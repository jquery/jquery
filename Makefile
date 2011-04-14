SRC_DIR = src
TEST_DIR = test
BUILD_DIR = build

PREFIX = .
DIST_DIR = ${PREFIX}/dist

JS_ENGINE ?= `which node nodejs`
COMPILER = ${JS_ENGINE} ${BUILD_DIR}/uglify.js --unsafe
POST_COMPILER = ${JS_ENGINE} ${BUILD_DIR}/post-compile.js

BASE_FILES = ${SRC_DIR}/core.js\
	${SRC_DIR}/deferred.js\
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
	${SRC_DIR}/ajax/jsonp.js\
	${SRC_DIR}/ajax/script.js\
	${SRC_DIR}/ajax/xhr.js\
	${SRC_DIR}/effects.js\
	${SRC_DIR}/offset.js\
	${SRC_DIR}/dimensions.js

MODULES = ${SRC_DIR}/intro.js\
	${BASE_FILES}\
	${SRC_DIR}/outro.js

JQ = ${DIST_DIR}/jquery.js
JQ_MIN = ${DIST_DIR}/jquery.min.js

SIZZLE_DIR = ${SRC_DIR}/sizzle

JQ_VER = $(shell cat version.txt)
VER = sed "s/@VERSION/${JQ_VER}/"

DATE=$(shell git log -1 --pretty=format:%ad)

all: update_submodules core

core: jquery min lint
	@@echo "jQuery build complete."

${DIST_DIR}:
	@@mkdir -p ${DIST_DIR}

jquery: ${JQ}

${JQ}: ${MODULES} | ${DIST_DIR}
	@@echo "Building" ${JQ}

	@@cat ${MODULES} | \
		sed 's/.function..jQuery...{//' | \
		sed 's/}...jQuery..;//' | \
		sed 's/@DATE/'"${DATE}"'/' | \
		${VER} > ${JQ};

${SRC_DIR}/selector.js: ${SIZZLE_DIR}/sizzle.js
	@@echo "Building selector code from Sizzle"
	@@sed '/EXPOSE/r src/sizzle-jquery.js' ${SIZZLE_DIR}/sizzle.js | grep -v window.Sizzle > ${SRC_DIR}/selector.js

lint: jquery
	@@if test ! -z ${JS_ENGINE}; then \
		echo "Checking jQuery against JSLint..."; \
		${JS_ENGINE} build/jslint-check.js; \
	else \
		echo "You must have NodeJS installed in order to test jQuery against JSLint."; \
	fi

min: jquery ${JQ_MIN}

${JQ_MIN}: ${JQ}
	@@if test ! -z ${JS_ENGINE}; then \
		echo "Minifying jQuery" ${JQ_MIN}; \
		${COMPILER} ${JQ} > ${JQ_MIN}.tmp; \
		${POST_COMPILER} ${JQ_MIN}.tmp > ${JQ_MIN}; \
		rm -f ${JQ_MIN}.tmp; \
	else \
		echo "You must have NodeJS installed in order to minify jQuery."; \
	fi
	

clean:
	@@echo "Removing Distribution directory:" ${DIST_DIR}
	@@rm -rf ${DIST_DIR}

	@@echo "Removing built copy of Sizzle"
	@@rm -f src/selector.js

distclean: clean
	@@echo "Removing submodules"
	@@rm -rf test/qunit src/sizzle

# change pointers for submodules and update them to what is specified in jQuery
# --merge  doesn't work when doing an initial clone, thus test if we have non-existing
#  submodules, then do an real update
update_submodules:
	@@if [ -d .git ]; then \
		if git submodule status | grep -q -E '^-'; then \
			git submodule update --init --recursive; \
		else \
			git submodule update --init --recursive --merge; \
		fi; \
	fi;

# update the submodules to the latest at the most logical branch
pull_submodules:
	@@git submodule foreach "git pull \$$(git config remote.origin.url)"
	@@git submodule summary

pull: pull_submodules
	@@git pull ${REMOTE} ${BRANCH}

.PHONY: all jquery lint min clean distclean update_submodules pull_submodules pull core
