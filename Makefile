SRC_DIR = src
BUILD_DIR = build

PREFIX = .
TEST_DIR = ${PREFIX}/test
DIST_DIR = ${PREFIX}/dist
SPEED_DIR = ${PREFIX}/speed

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

DATE=`svn info . | grep Date: | sed 's/.*: //g'`
REV=`svn info . | grep Rev: | sed 's/.*: //g'`

all: jquery test min speed
	@@echo "jQuery build complete."

${DIST_DIR}:
	@@mkdir -p ${DIST_DIR}

jquery: ${DIST_DIR} ${JQ}

${JQ}: ${MODULES}
	@@echo "Building" ${JQ}

	@@mkdir -p ${DIST_DIR}
	@@cat ${MODULES} | \
		sed 's/Date:./&'"${DATE}"'/' | \
		sed 's/Revision:./&'"${REV}"'/' | \
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

speed: ${JQ}
	@@echo "Building Speed Test Suite"

	@@echo " - Making Speed Test Suite Directory:" ${SPEED_DIR}
	@@mkdir -p ${SPEED_DIR}

	@@echo " - Copying over script files."
	@@cp -f ${BUILD_DIR}/speed/index.html ${SPEED_DIR}
	@@cp -f ${BUILD_DIR}/speed/benchmarker.css ${SPEED_DIR}
	@@cp -f ${BUILD_DIR}/speed/benchmarker.js ${SPEED_DIR}
	@@cp -f ${BUILD_DIR}/speed/jquery-basis.js ${SPEED_DIR}

	@@echo "Speed Test Suite Built"
	@@echo

clean:
	@@echo "Removing Distribution directory:" ${DIST_DIR}
	@@rm -rf ${DIST_DIR}

	@@echo "Removing Speed Test Suite directory:" ${SPEED_DIR}
	@@rm -rf ${SPEED_DIR}
