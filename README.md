Tube journey planner
====

tube-journey-planner is a purely client-side web app that helps you find your way through London Underground. It is designed to work on mobile browsers with offline capabilities.

Thanks to [indy](http://github.com/indy) for the original implementation of tube network data and the routing algorithm.

How to build
---

You need [NPM](https://www.npmjs.com/), [grunt-cli](http://gruntjs.com/), [bower](http://bower.io/) and [compass](http://compass-style.org/install/) installed in your development environment to build tube-journey-planner.

Once you cloned the repository, run the following commands to install the dependencies.

`npm install`

`bower install`

To run on local machine, run the following command. 

`grunt serve`

To build and upload to S3 bucket, create a aws-s3-credentials.json file as following:

```
{
  "accessKeyId": "...",
  "secretAccessKey": "..."
}
```
and then run the following command.

`grunt build`

Copyright and license
---

D3 library Copyright (c) 2012, Michael Bostock
All rights reserved.


Licensed under the Apache License, Version 2.0 (the "License");
you may not use this work except in compliance with the License.
You may obtain a copy of the License in the LICENSE file, or at:

   http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
