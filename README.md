# OmniCourse-core

_Core model for OmniCourse_

![GitHub CI](https://github.com/giancosta86/OmniCourse-core/actions/workflows/publish-to-npm.yml/badge.svg)
[![npm version](https://badge.fury.io/js/@giancosta86%2Fomnicourse-core.svg)](https://badge.fury.io/js/@giancosta86%2Fomnicourse-core)
[![MIT License](https://img.shields.io/badge/license-MIT-blue.svg?style=flat)](/LICENSE)

**OmniCourse-core** is a TypeScript library providing the core model of the [OmniCourse](https://github.com/giancosta86/OmniCourse) project; as a consequence, it is especially useful whenever you need to access its data structures without having to depend on the UI components.

## Installation

First of all, please consider whether you actually need [the full OmniCourse library](https://github.com/giancosta86/OmniCourse): in that case, directly depending on **OmniCourse-core** is not required - as the data structures are exported by **OmniCourse** as well.

The package on NPM is:

> @giancosta86/omnicourse-core

The public API entirely resides in the root package index, so one shouldn't reference specific modules.

## See also

- [OmniCourse](https://github.com/giancosta86/OmniCourse)
