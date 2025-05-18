
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function TermsOfServicePage() {
  return (
    <>
      <Navbar />
      <main className="flex-grow container py-12 md:py-16">
        <Card className="shadow-lg">
          <CardHeader>
            <CardTitle className="text-3xl md:text-4xl text-primary">Terms of Service</CardTitle>
          </CardHeader>
          <CardContent className="prose prose-lg max-w-none text-foreground/90">
            <p><strong>Last Updated: {new Date().toLocaleDateString()}</strong></p>

            <p>Please read these Terms of Service ("Terms", "Terms of Service") carefully before using the [Your Website URL] website (the "Service") operated by Valley Pet Waste Management ("us", "we", or "our").</p>

            <p>Your access to and use of the Service is conditioned on your acceptance of and compliance with these Terms. These Terms apply to all visitors, users, and others who access or use the Service.</p>

            <p>By accessing or using the Service you agree to be bound by these Terms. If you disagree with any part of the terms then you may not access the Service.</p>

            <h2>Accounts</h2>
            <p>When you create an account with us, you must provide us information that is accurate, complete, and current at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our Service.</p>
            <p>You are responsible for safeguarding the password that you use to access the Service and for any activities or actions under your password, whether your password is with our Service or a third-party service.</p>
            <p>You agree not to disclose your password to any third party. You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</p>

            <h2>Services</h2>
            <p>Valley Pet Waste Management provides pet waste removal services as described on our website. Service terms, including frequency and pricing, are agreed upon at the time of booking and are subject to change with notice.</p>
            <p>We reserve the right to refuse service or terminate services for any reason, including but not limited to unsafe conditions, aggressive pets, or non-payment.</p>
            
            <h2>Payments</h2>
            <p>Payment for services is due as per the agreed schedule. We accept various payment methods as indicated on our Service. Failure to make timely payments may result in suspension or termination of services.</p>

            <h2>Limitation Of Liability</h2>
            <p>In no event shall Valley Pet Waste Management, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from (i) your access to or use of or inability to access or use the Service; (ii) any conduct or content of any third party on the Service; (iii) any content obtained from the Service; and (iv) unauthorized access, use or alteration of your transmissions or content, whether based on warranty, contract, tort (including negligence) or any other legal theory, whether or not we have been informed of the possibility of such damage, and even if a remedy set forth herein is found to have failed of its essential purpose.</p>

            <h2>Governing Law</h2>
            <p>These Terms shall be governed and construed in accordance with the laws of the State of California, United States, without regard to its conflict of law provisions.</p>
            <p>Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights. If any provision of these Terms is held to be invalid or unenforceable by a court, the remaining provisions of these Terms will remain in effect. These Terms constitute the entire agreement between us regarding our Service, and supersede and replace any prior agreements we might have between us regarding the Service.</p>

            <h2>Changes</h2>
            <p>We reserve the right, at our sole discretion, to modify or replace these Terms at any time. If a revision is material we will try to provide at least 30 days notice prior to any new terms taking effect. What constitutes a material change will be determined at our sole discretion.</p>
            <p>By continuing to access or use our Service after those revisions become effective, you agree to be bound by the revised terms. If you do not agree to the new terms, please stop using the Service.</p>

            <h2>Contact Us</h2>
            <p>If you have any questions about these Terms, please contact us:</p>
            <ul>
                <li>By email: info@valleypetwaste.com</li>
                <li>By visiting this page on our website: [Your Contact Page URL]</li>
                <li>By phone number: (555) 123-4567</li>
            </ul>
          </CardContent>
        </Card>
      </main>
      <Footer />
    </>
  );
}
