# cf-node-finder

A simple CLI tool to find the best Cloudflare node for your location.

## Overview
This tests multiple Cloudflare endpoints to determine which one provides the lowest latency connection for your specific location. with information about which Cloudflare datacenter (colo) you're connecting through and your geographic location.

## Features

- Tests multiple Cloudflare endpoints (1.1.1.1, 1.0.0.1, cloudflare.com, dash.cloudflare.com)
- Shows which Cloudflare datacenter (colo) you're hitting
- Shows your geographic location according to Cloudflare
- Lightweight with zero dependencies beyond Node.js standard library

## Installation

### Prerequisites

- Node.js 12.x or higher


### Setup

1. Clone this repository
```bash
git clone https://github.com/GavinStrikes-Software/cf-node-finder
cd cf-node-finder
```

2. Make the script executable
```bash
chmod +x cf-node-finder.js
```

3. Optionally, link it to make it globally available
```bash
npm link
```

## Usage

Simply run the tool:

```bash
cf-node-finder
```

Sample output:
```
Finding fastest Cloudflare node for your location...

Testing 1.1.1.1... 23.45ms (DFW)
Testing 1.0.0.1... 25.67ms (DFW)
Testing cloudflare.com... 28.12ms (ATL)
Testing dash.cloudflare.com... 32.18ms (IAD)

--- Results ---
Best node: 1.1.1.1 (DFW)
Location: US
Latency: 23.45ms
```


## License

MIT
