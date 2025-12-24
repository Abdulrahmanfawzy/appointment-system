import { PhoneCall, Mail, MapPin } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";

// Define validation schema
const contactFormSchema = z.object({
  name: z.string().min(5, {
    message: "Name must be at least 5 characters.",
  }),
  email: z.string().email({
    message: "Please enter a valid email address.",
  }),
  message: z.string().min(10, {
    message: "Message must be at least 10 characters.",
  }),
});

type ContactFormValues = z.infer<typeof contactFormSchema>;

function ContactUs() {
  // Initialize form with validation
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      message: "",
    },
  });

  // Handle form submission
  function onSubmit(data: ContactFormValues) {
    console.log("Form submitted:", data);
    // TODO: Add your API call here
    // Example: await sendContactForm(data)

    // Reset form after successful submission
    form.reset();
  }

  return (
    <div className="min-h-screen py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Left Section - Contact Information */}
          <div>
            <h2 className="text-3xl font-bold text-[#05162C] mb-4">
              Contact Us
            </h2>
            <p className="text-gray-600 mb-8">
              We are committed to processing the information in order to contact you and talk about your questions
            </p>

            <div className="space-y-6">
              {/* Phone */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <PhoneCall className="w-4 h-4 text-[#145DB8]" />
                </div>
                <div>
                  <p className="text-[#05162C] font-medium">080 707 555-321</p>
                </div>
              </div>

              {/* Email */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <Mail className="w-4 h-4 text-[#145DB8]" />
                </div>
                <div>
                  <p className="text-[#05162C] font-medium">demo@example.com</p>
                </div>
              </div>

              {/* Address */}
              <div className="flex items-start gap-4">
                <div className="flex-shrink-0">
                  <MapPin className="w-4 h-4 text-[#145DB8]" />
                </div>
                <div>
                  <p className="text-[#05162C] font-medium max-w-xs">
                    526 Melrose Street, Water Mill, 11976 New York
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Section - Contact Form */}
          <div className="flex justify-center lg:justify-end">
            <Form {...form}>
              <form 
                onSubmit={form.handleSubmit(onSubmit)} 
                className="flex flex-col w-full max-w-[380px] gap-4"
              >
                {/* Name Field */}
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          placeholder="Name"
                          {...field}
                          className="w-full h-12 px-4 py-2 rounded-[10px] border"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Email Field */}
                <FormField
                  control={form.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Input
                          type="email"
                          placeholder="your.email@example.com"
                          {...field}
                          className="w-full h-12 px-4 py-2 rounded-[10px] border"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Message Field */}
                <FormField
                  control={form.control}
                  name="message"
                  render={({ field }) => (
                    <FormItem>
                      <FormControl>
                        <Textarea
                          placeholder="Message"
                          rows={6}
                          {...field}
                          className="w-full min-h-[195px] p-4 rounded-[15px] border resize-none"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {/* Submit Button */}
                <Button
                  type="submit"
                  className={cn(
                    "bg-[#145DB8] h-12 px-4 py-2 rounded-[10px]",
                    "hover:opacity-90 hover:bg-[#145DB8] transition-opacity"
                  )}
                  disabled={form.formState.isSubmitting}
                >
                  {form.formState.isSubmitting ? "Sending..." : "Send Message"}
                </Button>
              </form>
            </Form>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContactUs;
