ARG ARCH=aarch64
ARG VERSION=1.15
ARG UBUNTU_VERSION=22.04
ARG REPO=axisecp
ARG SDK=acap-native-sdk

FROM ${REPO}/${SDK}:${VERSION}-${ARCH}-ubuntu${UBUNTU_VERSION}

# Install Jansson library
RUN apt-get update && apt-get install -y libjansson-dev libcurl4-openssl-dev libglib2.0-dev

# Building the ACAP application
COPY ./app /opt/app/
WORKDIR /opt/app
RUN . /opt/axis/acapsdk/environment-setup* && \
    acap-build .
