V ?= 0

SRC_DIR = src
TEST_DIR = test
BUILD_DIR = build

PREFIX = .
DIST_DIR = ${PREFIX}/dist

RHINO ?= java -jar ${BUILD_DIR}/js.jar

CLOSURE_COMPILER = ${BUILD_DIR}/google-compiler-20100917.jar

MINJAR ?= java -jar ${CLOSURE_COMPILER}

BASE_FILES = ${SRC_DIR}/core.js\
	${SRC_DIR}/support.js\
	${SRC_DIR}/data.js\
	${SRC_DIR}/queue.js\
	${SRC_DIR}/attributes.js\
	${SRC_DIR}/event.js\
	${SRC_DIR}/selector.js\
	${SRC_DIR}/traversing.js\
	${SRC_DIR}/manipulation.js\
	${SRC_DIR}/css.js\
	${SRC_DIR}/ajax.js\
	${SRC_DIR}/effects.js\
	${SRC_DIR}/offset.js\
	${SRC_DIR}/dimensions.js

MODULES = ${SRC_DIR}/intro.js\
	${BASE_FILES}\
	${SRC_DIR}/outro.js

JQ = ${DIST_DIR}/jquery.js
JQ_MIN = ${DIST_DIR}/jquery.min.js

SIZZLE_DIR = ${SRC_DIR}/sizzle
QUNIT_DIR = ${TEST_DIR}/qunit

JQ_VER = $(shell cat version.txt)
VER = sed s/@VERSION/${JQ_VER}/

DATE=$(shell git log -1 --pretty=format:%ad)

all: init jquery min lint
	@@echo "jQuery build complete."

${DIST_DIR}:
	@@mkdir -p ${DIST_DIR}

ifeq ($(strip $(V)),0)
verbose = --quiet
else ifeq ($(strip $(V)),1)
verbose =
else
verbose = --verbose
endif

define clone_or_pull
-@@if test ! -d $(strip ${1})/.git; then \
		echo "Cloning $(strip ${1})..."; \
		git clone $(strip ${verbose}) --depth=1 $(strip ${2}) $(strip ${1}); \
	else \
		echo "Pulling $(strip ${1})..."; \
		git --git-dir=$(strip ${1})/.git pull $(strip ${verbose}) origin master; \
	fi

endef

init:
	$(call clone_or_pull, ${QUNIT_DIR}, git://github.com/jquery/qunit.git)
	$(call clone_or_pull, ${SIZZLE_DIR}, git://github.com/jeresig/sizzle.git)

jquery: ${JQ}
jq: ${JQ}

${JQ}: ${MODULES} ${DIST_DIR}
	@@echo "Building" ${JQ}

	@@cat ${MODULES} | \
		sed 's/.function..jQuery...{//' | \
		sed 's/}...jQuery..;//' | \
		sed 's/Date:./&'"${DATE}"'/' | \
		${VER} > ${JQ};

${SRC_DIR}/selector.js: ${SIZZLE_DIR}/sizzle.js
	@@echo "Building selector code from Sizzle"
	@@sed '/EXPOSE/r src/sizzle-jquery.js' ${SIZZLE_DIR}/sizzle.js | grep -v window.Sizzle > ${SRC_DIR}/selector.js

lint: ${JQ}
	@@echo "Checking jQuery against JSLint..."
	@@${RHINO} build/jslint-check.js

min: ${JQ_MIN}

${JQ_MIN}: ${JQ}
	@@echo "Building" ${JQ_MIN}

	@@head -15 ${JQ} > ${JQ_MIN}
	@@${MINJAR} --js ${JQ} --warning_level QUIET --js_output_file ${JQ_MIN}.tmp
	@@cat ${JQ_MIN}.tmp >> ${JQ_MIN}
	@@rm -f ${JQ_MIN}.tmp

clean:
	@@echo "Removing Distribution directory:" ${DIST_DIR}
	@@rm -rf ${DIST_DIR}

	@@echo "Removing built copy of Sizzle"
	@@rm -f src/selector.js

	@@echo "Removing cloned directories"
	@@rm -rf test/qunit src/sizzle

.PHONY: all jquery lint min init jq clean
