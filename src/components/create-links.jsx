import { useEffect, useRef, useState } from "react"
import { useNavigate, useSearchParams } from "react-router-dom"
import { BeatLoader } from "react-spinners"
import { QRCode } from "react-qrcode-logo"
import * as yup from "yup"

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Card } from "./ui/card"
import Error from "./error"
import useFetch from "@/hooks/use-fetch"
import { createUrl, isCustomUrlAvailable } from "@/db/apiUrls"
import { UrlState } from "@/context"
import { Toast } from "@/components/ui/toast"
import { LinkIcon, QrCode } from "lucide-react"

export function CreateLink({ isOpen, setIsOpen, onSuccess }) {
  const { user } = UrlState()
  const navigate = useNavigate()
  const qrCodeRef = useRef()
  const [searchParams, setSearchParams] = useSearchParams()
  const longLink = searchParams.get("createNew")
  const [open, setOpen] = useState(!!longLink)
  const [errors, setErrors] = useState({})
  const [isCheckingCustomUrl, setIsCheckingCustomUrl] = useState(false)
  const [formValues, setFormValues] = useState({
    title: "",
    longUrl: longLink || "",
    customUrl: "",
  })

  // Update internal open state when prop changes
  useEffect(() => {
    if (isOpen !== undefined) {
      setOpen(isOpen)
    }
  }, [isOpen])

  // Update search params when dialog closes
  useEffect(() => {
    if (!open && longLink) {
      setSearchParams({})
    }
  }, [open, longLink, setSearchParams])

  // Schema for form validation
  const schema = yup.object().shape({
    title: yup.string().required("Title is required"),
    longUrl: yup
      .string()
      .required("URL is required")
      .test("is-valid-url", "Must be a valid URL", (value) => {
        if (!value) return false
        try {
          new URL(value.startsWith("http") ? value : `https://${value}`)
          return true
        } catch (e) {
          return false
        }
      }),
    customUrl: yup
      .string()
      .matches(/^[a-zA-Z0-9-_]*$/, "Only letters, numbers, hyphens, and underscores are allowed")
      .max(50, "Custom URL must be less than 50 characters"),
  })

  // Handle form input changes
  const handleChange = (e) => {
    const { id, value } = e.target
    setFormValues((prev) => ({
      ...prev,
      [id]: value,
    }))

    // Clear error for this field when user types
    if (errors[id]) {
      setErrors((prev) => ({
        ...prev,
        [id]: undefined,
      }))
    }
  }

  // Create URL API hook
  const { loading, error, data, fn: fnCreateUrl } = useFetch(createUrl, { ...formValues, user_id: user?.id })

  // Handle successful URL creation
  useEffect(() => {
    if (!loading && !error && data) {
      // Close dialog
      setOpen(false)
      if (setIsOpen) setIsOpen(false)

      // Reset form
      setFormValues({
        title: "",
        longUrl: "",
        customUrl: "",
      })

      // Show success message
      Toast,({
        title: "Success!",
        description: "Your short URL has been created",
      })

      // Navigate to the new URL page
      navigate(`/link/${data[0].id}`)

      // Call success callback
      if (onSuccess) onSuccess()
    }
  }, [loading, error, data, navigate, setIsOpen, onSuccess])

  // Create a new short link
  const createNewLink = async () => {
    setErrors({})

    try {
      // Validate form
      await schema.validate(formValues, { abortEarly: false })

      // Check if custom URL is available
      if (formValues.customUrl) {
        setIsCheckingCustomUrl(true)
        const isAvailable = await isCustomUrlAvailable(formValues.customUrl)
        setIsCheckingCustomUrl(false)

        if (!isAvailable) {
          setErrors({ customUrl: "This custom URL is already taken" })
          return
        }
      }

      // Generate QR code
      if (!qrCodeRef.current?.canvasRef?.current) {
        setErrors({ qr: "Failed to generate QR code" })
        return
      }

      const canvas = qrCodeRef.current.canvasRef.current
      const blob = await new Promise((resolve) => canvas.toBlob(resolve))

      // Create URL
      await fnCreateUrl(blob)
    } catch (e) {
      // Handle validation errors
      if (e?.inner) {
        const newErrors = {}
        e.inner.forEach((err) => {
          newErrors[err.path] = err.message
        })
        setErrors(newErrors)
      } else if (e?.message) {
        // Handle API errors
        setErrors({ api: e.message })
      }
    }
  }

  // Normalize URL for QR code
  const qrCodeUrl = formValues.longUrl
    ? formValues.longUrl.startsWith("http")
      ? formValues.longUrl
      : `https://${formValues.longUrl}`
    : ""

  return (
    <Dialog
      open={open}
      onOpenChange={(value) => {
        setOpen(value)
        if (setIsOpen) setIsOpen(value)
      }}
    >
      <DialogTrigger asChild>
        <Button variant="destructive">Create New Link</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="font-bold text-2xl">Create New Link</DialogTitle>
        </DialogHeader>

        {/* QR Code Preview */}
        <div className="flex justify-center mb-4">
          {qrCodeUrl ? (
            <div className="border border-gray-200 rounded-lg p-2 bg-white">
              <QRCode ref={qrCodeRef} size={200} value={qrCodeUrl} quietZone={10} ecLevel="H" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center w-[200px] h-[200px] border border-gray-200 rounded-lg bg-gray-50">
              <QrCode className="h-12 w-12 text-gray-300 mb-2" />
              <p className="text-sm text-gray-400">Enter a URL to generate QR code</p>
            </div>
          )}
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div>
            <Input
              id="title"
              placeholder="Link Title (e.g. My Blog)"
              value={formValues.title}
              onChange={handleChange}
            />
            {errors.title && <Error message={errors.title} />}
          </div>

          <div className="relative">
            <LinkIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
            <Input
              id="longUrl"
              placeholder="Enter your long URL (e.g. example.com/very-long-url)"
              value={formValues.longUrl}
              onChange={handleChange}
              className="pl-10"
            />
            {errors.longUrl && <Error message={errors.longUrl} />}
          </div>

          <div className="flex items-center gap-2">
            <Card className="p-2 bg-gray-50 text-gray-500 text-sm">yurl.in/</Card>
            <Input
              id="customUrl"
              placeholder="Custom path (optional)"
              value={formValues.customUrl}
              onChange={handleChange}
            />
          </div>
          {errors.customUrl && <Error message={errors.customUrl} />}

          {errors.qr && <Error message={errors.qr} />}
          {errors.api && <Error message={errors.api} />}
          {error && <Error message={typeof error === "object" ? error.message : String(error)} />}
        </div>

        <DialogFooter className="sm:justify-start">
          <Button
            type="button"
            variant="destructive"
            onClick={createNewLink}
            disabled={loading || isCheckingCustomUrl}
            className="w-full sm:w-auto"
          >
            {loading || isCheckingCustomUrl ? <BeatLoader size={8} color="white" /> : "Create Short Link"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

