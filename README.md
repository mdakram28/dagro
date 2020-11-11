# DAgro

### An Ethereum based distributed transparent farmers market

# Introduction

Agroshare is evolution of the basic community-supported agriculture model, which takes advantage of the blockchain’s potential for distributed accord, token-based equity shares and automatic governance so as to foster larger community engagement whereas removing a number of the social control burdens and monetary risks from farmers concerned in an exceedingly CSA. The goal is to come back to the basic goals of the initial CSAs: to form new kinds of property possession, community cooperation, and regionally independent economies.

Agroshare differs from each original and modern community-supported agriculture in many key ways that. instead of operational as one farm, Agroshare is a platform for entire communities to form a parallel economy for the assembly, processing, distribution, and consumption of native food. Moreover, shares aren't purchased earlier than time at a flat fee, however rather earned by supporting and tributary to the native food system.

Shares could also be issued for volunteering on the farm, transporting food, tributary to a crowdfunding campaign, sharing process instrumentation, taking part in an academic workshop, and anything a community assigns worth to. Shares could also be changed for food from a network of farmers markets, co-op stores, specialty markets, restaurants and food pantries.

# Overview

Mharo Vyapaar is evolution of the basic community-supported agriculture model, which takes advantage of the blockchain’s potential for distributed accord, token-based equity shares and automatic governance so as to foster larger community engagement whereas removing a number of the social control burdens and monetary risks from farmers concerned in an exceedingly CSA. The goal is to come back to the basic goals of the initial CSAs to form new kinds of property possession, community cooperation, and regionally independent economies.

Mharo Vyapaar differs from each original and modern community-supported agriculture in many key ways that. instead of operational as one farm, Mharo Vyapaar is a platform for entire communities to form a parallel economy for the assembly, processing, distribution, and consumption of native food. moreover, shares aren't purchased earlier than time at a flat fee, however rather earned by supporting and tributary to the native food system. Shares could also be issued for volunteering on the farm, transporting food, tributary to a crowdfunding campaign, sharing process instrumentation, taking part in an academic workshop, and anything a community assigns worth to. Shares could also be changed for food from a network of farmers markets, co-op stores, specialty markets, restaurants and food pantries.

# Technology Stack

## Web3

The web3.js library is a collection of modules which contain specific functionality for the ethereum ecosystem.

- The web3-eth is for the ethereum blockchain and smart contracts
- The web3-shh is for the whisper protocol to communicate p2p and broadcast
- The web3-bzz is for the swarm protocol, the decentralized file storage
- The web3-utils contains useful helper functions for Dapp developers.

## Truffle framework

Truffle is a world class development environment, testing framework and asset pipeline for Ethereum, aiming to make life as an Ethereum developer easier. With Truffle, we get:

- Built-in smart contract compilation, linking, deployment and binary management.
- Automated contract testing for rapid development.
- Scriptable, extensible deployment & migrations framework.
- Network management for deploying to any number of public & private networks.

## AWS EC2

Amazon EC2 reduces the time required to obtain and boot new server instances to minutes, allowing you to quickly scale capacity, both up and down, as your computing requirements change. Amazon EC2 changes the economics of computing by allowing you to pay only for capacity that you actually use.

## Implementation

### connecting web3.js with HTML

So for serverless connection of an HTML front-end to a local node

1. drop web3.js into the DAPP's directory
2. include in HTML:

```HTML
<script type="text/javascript" src="web3.js"></script>
<script type='text/javascript'>
var Web3 = require('web3');

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider);
} else {
  // set the provider you want from Web3.providers
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}
```

3. Start geth with the --rpccorsdomain="\*" switch to prevent Chrome from blocking the calls.

#### Running

Just do `npm install` and then `npm run dev`
