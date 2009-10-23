SRC_DIR = src
BUILD_DIR = build

PREFIX = .
TEST_DIR = ${PREFIX}/test
DIST_DIR = ${PREFIX}/dist

BASE_FILES = ${SRC_DIR}/core.js\
	${SRC_DIR}/data.js\
	${SRC_DIR}/event.js\
	${SRC_DIR}/support.js\
	${SRC_DIR}/selector.js\
	${SRC_DIR}/traversing.js\
	${SRC_DIR}/attributes.js\
	${SRC_DIR}/manipulation.js\
	${SRC_DIR}/css.js\
	${SRC_DIR}/ajax.js\
	${SRC_DIR}/fx.js\
	${SRC_DIR}/offset.js\
	${SRC_DIR}/dimensions.js

MODULES = ${SRC_DIR}/intro.js\
	${BASE_FILES}\
	${SRC_DIR}/outro.js

JQ = ${DIST_DIR}/jquery.js
JQ_MIN = ${DIST_DIR}/jquery.min.js

JQ_VER = `cat version.txt`
VER = sed s/@VERSION/${JQ_VER}/

MINJAR = java -jar ${BUILD_DIR}/yuicompressor-2.4.2.jar

DATE=`git log -1 | grep Date: | sed 's/.*: *//g'`

all: jquery test min
	@@echo "jQuery build complete."

${DIST_DIR}:
	@@mkdir -p ${DIST_DIR}

jquery: ${DIST_DIR} ${JQ}

${JQ}: ${MODULES}
	@@echo "Building" ${JQ}

	@@mkdir -p ${DIST_DIR}
	@@cat ${MODULES} | \
		sed 's/Date:./&'"${DATE}"'/' | \
		${VER} > ${JQ};

	@@echo ${JQ} "Built"
	@@echo

min: ${JQ_MIN}

${JQ_MIN}: ${JQ}
	@@echo "Building" ${JQ_MIN}

	@@echo " - Compressing using Minifier"
	@@${MINJAR} ${JQ} > ${JQ_MIN}

	@@echo ${JQ_MIN} "Built"
	@@echo

test: ${JQ}
	@@echo "Building Test Suite"
	@@echo "Test Suite Built"
	@@echo
	git submodule init
	git submodule update

clean:
	@@echo "Removing Distribution directory:" ${DIST_DIR}
	@@rm -rf ${DIST_DIR}
