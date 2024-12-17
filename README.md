# vulnode
A showcase of two security considerations that need to be taken into account when using express in production.

This project is part of the "Security in Information Systems" course in the fourth year of the "Computer Engineering" university degree.

A technical report (in spanish) explaning the bad practices mentioned in this application can be found here.

## Disclaimer

This application is NOT meant to run in a production-like environment. It is displayed here as a proof of concept and as a learning exercise.

## Running

This application is _dockerized_ and contains a reverse proxy.

1. First, clone the repository:
```
git clone https://github.com/nicoagr/vulnode.git
```
2. _cd_ into the cloned folder.
3. Install the [docker engine](https://docs.docker.com/engine/install/) into your machine if you already haven't.
4. The application can be simply run using:
```
docker-compose up -d
```
5. Now the application will be running in the port 8888 of your machine.


### Legal

WTFPL (See the LICENSE file)
