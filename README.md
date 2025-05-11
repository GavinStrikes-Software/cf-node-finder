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
node cf-node-finder.js
```

Sample output:
```
[gavinstrikes@archlinux cf-node-finder]$ node cf-node-finder.js 
Finding fastest Cloudflare node for your location...

Testing 1.1.1.1... Testing 1.0.0.1... Testing cloudflare.com... Testing dash.cloudflare.com... 44.51ms (ATL)
43.25ms (ATL)
48.17ms (ATL)
47.23ms (ATL)

--- Results ---
Best node: 1.0.0.1 (ATL)
Location: US
Latency: 43.25ms
```


## License

MIT
