import React from 'react';
import { Button, Label, TextInput, Textarea } from 'flowbite-react';

export default function Contact() {
  return (
    <div className="container mx-auto p-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Contact Us</h1>
        <p className="text-lg text-gray-700 dark:text-gray-400">
          We would love to hear from you! Please fill out the form below and we will get in touch with you shortly.
        </p>
      </div>
      
      <form className="max-w-xl mx-auto">
        <div className="mb-6">
          <Label htmlFor="name" value="Your Name" />
          <TextInput id="name" type="text" placeholder="Sree" required={true} className="mt-1" />
        </div>
        
        <div className="mb-6">
          <Label htmlFor="email" value="Your Email" />
          <TextInput id="email" type="email" placeholder="sree@example.com" required={true} className="mt-1" />
        </div>
        
        <div className="mb-6">
          <Label htmlFor="message" value="Your Message" />
          <Textarea id="message" placeholder="Write your message here..." required={true} rows={4} className="mt-1" />
        </div>
        
        <Button type="submit">Send Message</Button>
      </form>
    </div>
  );
}
