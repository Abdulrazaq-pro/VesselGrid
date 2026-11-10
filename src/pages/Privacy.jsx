import Legal from './Legal'
export default function Privacy() {
  return <Legal title="Privacy Policy" sections={[
    ['Who we are', 'VesselGrid ("we", "us") operates www.vesselgrid.site and is developing software for vessel arrival prediction, berth scheduling and harbor service dispatch. Contact: lanre@vesselgrid.site.'],
    ['What we collect', 'When you submit the early-access or contact form we collect the details you enter: name, email address, company, company size, use case, inquiry type and message. We do not run advertising trackers on this site. Our hosting provider may log standard technical data such as IP address, browser type and pages requested for security and operations.'],
    ['How we use it', 'We use form submissions to respond to you, to manage early-access requests and to understand which port operations problems matter most to prospective customers. We do not sell personal information.'],
    ['Third parties', 'Form submissions are delivered through a third-party form-processing service and stored in our business email. The website is served by a hosting provider. These providers process data on our behalf only to deliver those services.'],
    ['Product data', 'The interactive preview on this website uses fictional sample data and does not collect vessel, terminal or customer operational data. Terms for processing customer operational data in the VesselGrid platform will be set out in customer agreements.'],
    ['Retention', 'We keep inquiry and early-access records for as long as needed to respond and to maintain a business relationship, and delete them on request unless we must keep them for legal reasons.'],
    ['Your rights', 'You may ask to access, correct or delete the personal information you have given us, or object to its use, by emailing lanre@vesselgrid.site. Depending on where you live, data protection law (for example the Nigeria Data Protection Act 2023 or the GDPR) may give you additional rights.'],
    ['Changes', 'We will update this page when our practices change and revise the date above.'],
  ]} />
}
