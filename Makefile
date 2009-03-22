SRC_DIR = src
BUILD_DIR = build

PREFIX = .
DOCS_DIR = ${PREFIX}/docs
TEST_DIR = ${PREFIX}/test
DIST_DIR = ${PREFIX}/dist
SPEED_DIR = ${PREFIX}/speed
PLUG_DIR = ../plugins

BASE_FILES = ${SRC_DIR}/core.js\
	${SRC_DIR}/data.js\
	${SRC_DIR}/selector.js\
	${SRC_DIR}/traversing.js\
	${SRC_DIR}/attributes.js\
	${SRC_DIR}/manipulation.js\
	${SRC_DIR}/event.js\
	${SRC_DIR}/support.js\
	${SRC_DIR}/css.js\
	${SRC_DIR}/ajax.js\
	${SRC_DIR}/fx.js\
	${SRC_DIR}/offset.js\
	${SRC_DIR}/dimensions.js

PLUGINS = ${PLUG_DIR}/button/*\
	${PLUG_DIR}/center/*\
	${PLUG_DIR}/cookie/*\
	${PLUG_DIR}/dimensions/*\
	${PLUG_DIR}/metadata/*\
	${PLUG_DIR}/form/*\
	${PLUG_DIR}/greybox/greybox.js\
	${PLUG_DIR}/interface/*\
	${PLUG_DIR}/pager/*\
	${PLUG_DIR}/tablesorter/*\
	${PLUG_DIR}/tabs/*\
	${PLUG_DIR}/tooltip/jquery.tooltip.js\
	${PLUG_DIR}/accordion/jquery.accordion.js

MODULES = ${SRC_DIR}/intro.js\
	${BASE_FILES}\
	${SRC_DIR}/outro.js

MODULES_WITH_PLUGINS = ${SRC_DIR}/intro.js\
	${BASE_FILES}\
	${PLUGINS}\
	${SRC_DIR}/outro.js

JQ = ${DIST_DIR}/jquery.js
JQ_LITE = ${DIST_DIR}/jquery.lite.js
JQ_MIN = ${DIST_DIR}/jquery.min.js
JQ_PACK = ${DIST_DIR}/jquery.pack.js

JQ_VER = `cat version.txt`
VER = sed s/@VERSION/${JQ_VER}/

JAR = java -Dfile.encoding=utf-8 -jar ${BUILD_DIR}/js.jar
MINJAR = java -jar ${BUILD_DIR}/yuicompressor-2.4.2.jar

DATE=`svn info . | grep Date: | sed 's/.*: //g'`
REV=`svn info . | grep Rev: | sed 's/.*: //g'`

all: jquery min speed
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

with_plugins: ${MODULES_WITH_PLUGINS}
	@@echo "Building" ${JQ}

	@@mkdir -p ${DIST_DIR}
	@@cat ${MODULES_WITH_PLUGINS} | ${VER} > ${JQ};

	@@echo ${JQ} "Built"
	@@echo

lite: ${JQ_LITE}

${JQ_LITE}: ${JQ}
	@@echo "Building" ${JQ_LITE}

	@@cp ${JQ} ${JQ_LITE}

	@@echo ${JQ_LITE} "Built"
	@@echo

pack: ${JQ_PACK}

${JQ_PACK}: ${JQ}
	@@echo "Building" ${JQ_PACK}

	@@echo " - Compressing using Packer"
	@@${JAR} ${BUILD_DIR}/build/pack.js ${JQ} ${JQ_PACK}

	@@echo ${JQ_PACK} "Built"
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

runtest: ${JQ} test
	@@echo "Running Automated Test Suite"
	@@${JAR} ${BUILD_DIR}/runtest/test.js

	@@echo "Test Suite Finished"
	@@echo

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

	@@echo "Removing Documentation directory:" ${DOCS_DIR}
	@@rm -rf ${DOCS_DIR}

	@@echo "Removing Speed Test Suite directory:" ${SPEED_DIR}
	@@rm -rf ${SPEED_DIR}
