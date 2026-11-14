export const company = {
  name: 'Vesselgrid',
  domain: 'vesselgrid.site',
  url: 'https://www.vesselgrid.site',
  email: 'nimot@vesselgrid.site',
  linkedin: 'https://www.linkedin.com/company/vesselgrid',
  founded: '2026',
  founder: { name: 'Nimotallah Lawal', title: 'Founder', linkedin: 'https://www.linkedin.com/in/neemah-lawal-306171396', photo: '/founder.webp' },
  stage: 'Building initial product',
  tagline: 'AI vessel ETAs, berth scheduling and harbor dispatch for terminal operators and shipping lines.',
  positioning:
    'Vesselgrid helps terminal operators and shipping lines cut vessel waiting time by predicting arrivals from live AIS and weather data and turning those predictions into a berth, tug and pilot plan that updates as ships move.',
}

export const pricing = [
  { name: 'Starter', price: '$30', for: 'Single-berth operators and harbor service providers getting started.', items: ['Vessel arrival board', 'Predictive ETA for tracked vessels', 'Manual berth plan with conflict checks', 'One user workspace'] },
  { name: 'Growth', price: '$70', for: 'Terminals running several berths and daily schedule changes.', items: ['Everything in Starter', 'Dynamic berth scheduler', 'Tug and pilot dispatch planning', 'Congestion risk alerts', 'Team workspace'], featured: true },
  { name: 'Enterprise', price: '$100', for: 'Multi-terminal operators, port authorities and shipping lines.', items: ['Everything in Growth', 'AI shift summaries and risk reports', 'Multi-terminal views', 'Integration support for terminal systems', 'Priority onboarding'] },
]

export const awsServices = [
  ['Amazon API Gateway', 'Receives AIS position feeds, terminal updates and client requests through a single authenticated REST interface.'],
  ['AWS Lambda', 'Normalises incoming telemetry, runs berth conflict checks and triggers re-planning when an ETA moves.'],
  ['Amazon S3', 'Holds the historical data lake of vessel tracks, weather and port calls used to train and retrain ETA models.'],
  ['Amazon SageMaker', 'Trains and hosts the time-series models that predict vessel arrival times and congestion risk.'],
  ['Amazon DynamoDB', 'Stores live operational state: berth assignments, vessel queues, crane allocations and dispatch jobs.'],
  ['Amazon Bedrock', 'Generates plain-language shift handover summaries and risk reports for port and terminal managers.'],
]

export const features = [
  ['Predictive ETA Engine', 'Combines AIS speed and heading, marine weather and historical route bottlenecks to forecast when each vessel will actually reach the fairway buoy and the berth.', 'Planners work from a realistic arrival window instead of the agent\'s declared ETA.'],
  ['Dynamic Berth Scheduler', 'Sequences incoming calls against berth length, draft limits, cargo type and crane availability, and re-sequences when an ETA changes.', 'Fewer manual reshuffles and fewer ships waiting at anchorage for a berth that is already free.'],
  ['Congestion Risk Analytics', 'Projects yard occupancy, gang requirements and berth demand up to 72 hours ahead and flags the shifts at risk.', 'Labour and yard space can be arranged before the queue forms.'],
  ['Tug & Pilot Dispatch', 'Builds tug and pilot schedules from the berth plan, matching vessel size and tide windows with crew availability.', 'Harbor services stop chasing last-minute calls and idle crews are reduced.'],
  ['AI Shift Reports', 'Writes the end-of-shift handover: arrivals, delays, conflicts resolved and open risks, in plain language.', 'Shift managers spend minutes, not an hour, on the handover log.'],
  ['Exception Review Queue', 'Every conflict the scheduler cannot resolve on its own lands in a queue with the proposed fix and the reason.', 'People stay in control of berth decisions, and every change has a record.'],
]

export const segments = [
  ['Terminal operators', 'Berth plans are rebuilt by hand whenever a vessel runs early or late, and quay cranes sit idle while ships wait outside.', 'Run the berth plan and crane allocation from predicted arrivals, review exceptions, publish updates to lines and agents.'],
  ['Port authorities', 'Anchorage congestion builds without warning and the fairway, pilots and tugs become the bottleneck.', 'Watch congestion risk across terminals and see which tide windows and shifts are overloaded 72 hours out.'],
  ['Shipping lines & fleet managers', 'Vessels steam at full speed to arrive and then wait days at anchor, burning fuel and charter time.', 'See realistic berth windows early enough to adjust speed and avoid waiting at anchorage.'],
  ['Harbor service providers', 'Tug operators, pilots and drayage dispatchers learn about jobs late and staff for the worst case.', 'Receive dispatch schedules derived from the live berth plan, with tide and vessel requirements attached.'],
]
