import Legal from './Legal'
export default function Terms() {
  return <Legal title="Terms of Service" sections={[
    ['Agreement', 'These terms govern your use of www.vesselgrid.site and the VesselGrid workspace and any subscription service ("Service"). By using the Service you agree to them. Separate written agreements with customers take precedence where they conflict.'],
    ['Service status', 'Features are improved continuously and may change. Workspace data is stored in your account on Google Cloud infrastructure; export to CSV at any time. The home-page preview uses example records for a fictional terminal.'],
    ['Accounts and customer duties', 'Customers are responsible for the accuracy of the data they provide, for keeping access credentials secure and for the actions of their users.'],
    ['Operational decisions', 'VesselGrid provides predictions, schedules and recommendations to support planning. It does not replace navigational, pilotage, safety or regulatory judgment. Customers remain responsible for all berthing, dispatch and vessel movement decisions and for compliance with port rules.'],
    ['Acceptable use', 'You may not misuse the Service, attempt unauthorised access, interfere with its operation, reverse engineer it except where law allows, or use it to process data you have no right to use.'],
    ['Fees', 'Subscription fees are as published on the website or agreed in writing, billed monthly or annually in US dollars and invoiced by our team, unless otherwise agreed.'],
    ['Intellectual property', 'VesselGrid owns the Service, software, design and brand. Customers own their data and grant VesselGrid the rights needed to provide the Service.'],
    ['Disclaimers', 'The Service is provided "as is" and "as available". Predictions are estimates and may be inaccurate. To the extent permitted by law we disclaim implied warranties of merchantability, fitness for a particular purpose and non-infringement.'],
    ['Limitation of liability', 'To the extent permitted by law, VesselGrid is not liable for indirect or consequential losses, including demurrage, delay or lost profit, and our total liability is limited to the fees paid for the Service in the 12 months before the claim.'],
    ['Changes and contact', 'We may update these terms and will revise the date above. Questions: nimot@vesselgrid.site.'],
  ]} />
}
