#!/usr/bin/env node

const https = require('https');
const { performance } = require('perf_hooks');

const cf_endpoints = [
    { name: '1.1.1.1', url: 'https://1.1.1.1/cdn-cgi/trace' },
{ name: '1.0.0.1', url: 'https://1.0.0.1/cdn-cgi/trace' },
{ name: 'cloudflare.com', url: 'https://cloudflare.com/cdn-cgi/trace' },
{ name: 'dash.cloudflare.com', url: 'https://dash.cloudflare.com/cdn-cgi/trace' }
];

const default_pings = 3;
const default_timeout = 2000;

function pingendpoint(url, timeout = default_timeout) {
    return new Promise((resolve, reject) => {
        const starttime = performance.now();

        const req = https.get(url, { timeout }, (res) => {
            let data = '';

            res.on('data', chunk => {
                data += chunk;
            });

            res.on('end', () => {
                const endtime = performance.now();
                const latency = endtime - starttime;

                if (res.statusCode !== 200) {
                    reject(new Error(`HTTP ${res.statusCode}`));
                    return;
                }

                const info = {};
                data.split('\n').forEach(line => {
                    const parts = line.split('=');
                    if (parts.length === 2) {
                        info[parts[0]] = parts[1];
                    }
                });

                resolve({ latency, info });
            });
        });

        req.on('error', reject);

        req.on('timeout', () => {
            req.destroy();
            reject(new Error('Timeout'));
        });
    });
}

async function pingallendpoints(endpoint, count = default_pings) {
    const results = [];

    for (let i = 0; i < count; i++) {
        try {
            const result = await pingendpoint(endpoint.url);
            results.push(result);
        } catch (err) {
            console.log(`Failed ping to ${endpoint.name}: ${err.message}`);
        }

        if (i < count - 1) {
            await new Promise(r => setTimeout(r, 300));
        }
    }

    if (results.length === 0) {
        return null;
    }

    const avgLatency = results.reduce((sum, r) => sum + r.latency, 0) / results.length;
    const colo = results[0].info.colo;
    const loc = results[0].info.loc;

    return {
        name: endpoint.name,
        colo,
        loc,
        latency: avgLatency
    };
}

async function findbestnode() {
    console.log('Finding fastest Cloudflare node for your location...\n');

    const promises = cf_endpoints.map(endpoint => {
        process.stdout.write(`Testing ${endpoint.name}... `);
        return pingallendpoints(endpoint).then(result => {
            if (result) {
                process.stdout.write(`${result.latency.toFixed(2)}ms (${result.colo})\n`);
            } else {
                process.stdout.write('failed\n');
            }
            return result;
        });
    });

    const results = (await Promise.all(promises)).filter(r => r !== null);

    if (results.length === 0) {
        console.log('\nCould not reach any Cloudflare nodes.');
        return;
    }

    results.sort((a, b) => a.latency - b.latency);

    console.log('\n--- Results ---');
    console.log(`Best node: ${results[0].name} (${results[0].colo})`);
    console.log(`Location: ${results[0].loc}`);
    console.log(`Latency: ${results[0].latency.toFixed(2)}ms`);

    return results[0];
}

if (require.main === module) {
    findbestnode();
}

module.exports = { findbestnode };
