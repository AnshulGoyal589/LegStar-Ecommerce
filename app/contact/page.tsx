"use client"

import type React from "react"
import { useState } from "react"
import Link from "next/link"
import { Footer } from "@/components/layout/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Mail, Clock, Send, CheckCircle } from "lucide-react"
import { toast } from "sonner"

const contactInfo = [
  {
    icon: Mail,
    title: "Email Us",
    details: "customercarelegstar@gmail.com",
    description: "We aim to respond within 24 hours.",
    link: "mailto:customercarelegstar@gmail.com",
  },
  {
    icon: Clock,
    title: "Office Hours",
    details: "Tuesday to Sunday",
    description: "09:00 AM – 05:00 PM",
  },
]

const faqs = [
  {
    question: "What is your return policy?",
    answer:
      "We offer a 30-day hassle-free return policy on all products. Items must be unused and in original packaging.",
  },
  {
    question: "How long does shipping take?",
    answer:
      "Standard shipping takes 5-7 business days. Express shipping (2-3 days) is available for an additional charge.",
  },
  {
    question: "Do you offer international shipping?",
    answer:
      "Currently, we ship only within India. International shipping will be available soon.",
  },
  {
    question: "How can I track my order?",
    answer:
      "Once your order is shipped, you'll receive a tracking link via email and SMS.",
  },
]

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isSubmitted, setIsSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setIsSubmitting(true)

    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500))

    setIsSubmitting(false)
    setIsSubmitted(true)
    toast.success("Message sent successfully!", {
      description: "We'll get back to you within 24 hours.",
    })
  }

  return (
    <div className="min-h-screen flex flex-col">
      <main className="flex-1">
        {/* B2B Partner Banner Section */}
        <section className="bg-slate-900 text-white py-16 md:py-20">
          <div className="container mx-auto px-4 text-center">
            <h2 className="text-3xl md:text-4xl font-serif font-bold mb-4">
              Partner with Legstar for B2B
            </h2>
            <p className="max-w-3xl mx-auto text-lg text-slate-300 mb-8">
              Unlock exclusive wholesale pricing, dedicated support, and grow
              your business with our premium collection. Join our network of
              successful partners today.
            </p>
            <Button
              asChild
              size="lg"
              className="bg-white text-slate-900 hover:bg-slate-200"
            >
              <Link href="/partner">Become a Partner</Link>
            </Button>
          </div>
        </section>

        {/* Contact Info Cards */}
        <section className="py-12 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="grid md:grid-cols-2 lg:grid-cols-2 gap-6">
              {contactInfo.map((info) => (
                <div
                  key={info.title}
                  className="bg-card rounded-xl p-6 border border-border text-center hover:shadow-lg transition-shadow"
                >
                  <div className="h-12 w-12 rounded-full bg-[#e6d8b2]/50 flex items-center justify-center mx-auto mb-4">
                    <info.icon className="h-6 w-6 text-primary" />
                  </div>
                  <h3 className="font-bold mb-2">{info.title}</h3>

                  <p key={info.title} className="text-sm text-muted-foreground">
                    {info.details}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Contact Form & Map */}
        <section id="contact-form" className="py-16 md:py-24">
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-1 px-24 gap-12">
              {/* Form */}
              <div>
                <div className="mb-8">
                  <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                    Send a Message
                  </span>
                  <h2 className="text-3xl font-serif font-bold mt-2">
                    Contact Form
                  </h2>
                  <p className="text-muted-foreground mt-2">
                    Fill out the form below and we&apos;ll get back to you
                    within 24 hours.
                  </p>
                </div>

                {isSubmitted ? (
                  <div className="bg-green-50 border border-green-200 rounded-xl p-8 text-center">
                    <CheckCircle className="h-16 w-16 text-green-500 mx-auto mb-4" />
                    <h3 className="text-xl font-bold mb-2">Thank You!</h3>
                    <p className="text-muted-foreground mb-4">
                      Your message has been sent successfully. We&apos;ll get
                      back to you shortly.
                    </p>
                    <Button
                      onClick={() => setIsSubmitted(false)}
                      variant="outline"
                    >
                      Send Another Message
                    </Button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name *</Label>
                        <Input id="firstName" placeholder="John" required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name *</Label>
                        <Input id="lastName" placeholder="Doe" required />
                      </div>
                    </div>

                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="email">Email *</Label>
                        <Input
                          id="email"
                          type="email"
                          placeholder="john@example.com"
                          required
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+91 98765 43210"
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="subject">Subject *</Label>
                      <Select required>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a subject" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="general">
                            General Inquiry
                          </SelectItem>
                          <SelectItem value="order">Order Related</SelectItem>
                          <SelectItem value="return">
                            Returns & Refunds
                          </SelectItem>
                          <SelectItem value="feedback">Feedback</SelectItem>
                          <SelectItem value="complaint">Complaint</SelectItem>
                          <SelectItem value="partnership">
                            Business Partnership
                          </SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="message">Message *</Label>
                      <Textarea
                        id="message"
                        placeholder="Tell us how we can help you..."
                        rows={5}
                        required
                      />
                    </div>

                    <Button
                      type="submit"
                      size="lg"
                      className="w-full bg-[#e6d8b2] text-foreground hover:bg-[#d4c9a3] gap-2"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        "Sending..."
                      ) : (
                        <>
                          <Send className="h-4 w-4" />
                          Send Message
                        </>
                      )}
                    </Button>
                  </form>
                )}
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-16 md:py-24 bg-muted/50">
          <div className="container mx-auto px-4">
            <div className="text-center mb-12">
              <span className="text-sm font-medium text-muted-foreground uppercase tracking-wider">
                Quick Answers
              </span>
              <h2 className="text-3xl md:text-4xl font-serif font-bold mt-2">
                Frequently Asked Questions
              </h2>
            </div>

            <div className="max-w-3xl mx-auto grid gap-4">
              {faqs.map((faq, index) => (
                <div
                  key={index}
                  className="bg-card rounded-xl p-6 border border-border"
                >
                  <h3 className="font-bold mb-2">{faq.question}</h3>
                  <p className="text-sm text-muted-foreground">
                    {faq.answer}
                  </p>
                </div>
              ))}
            </div>

            <div className="text-center mt-8">
              <p className="text-muted-foreground mb-4">
                Can&apos;t find what you&apos;re looking for?
              </p>
              <Button asChild variant="outline">
                <Link href="#contact-form">Contact Our Support Team</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}