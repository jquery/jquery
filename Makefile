SRC_DIR = src
BUILD_DIR = build

PREFIX = .
DOCS_DIR = ${PREFIX}/docs
TEST_DIR = ${PREFIX}/test
DIST_DIR = ${PREFIX}/dist
PLUG_DIR = ../plugins

BASE_FILES = ${SRC_DIR}/jquery/jquery.js\
	${SRC_DIR}/selector/selector.js\
	${SRC_DIR}/event/event.js\
	${SRC_DIR}/fx/fx.js\
	${SRC_DIR}/ajax/ajax.js

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
JQ_PACK = ${DIST_DIR}/jquery.pack.js

JQ_VER = `cat version.txt`
VER = sed s/@VERSION/${JQ_VER}/

JAR = java -jar ${BUILD_DIR}/js.jar

all: jquery lite pack docs test
	@@echo "jQuery build complete."

${DIST_DIR}:
	@@mkdir -p ${DIST_DIR}

jquery: ${DIST_DIR} ${JQ}

${JQ}: ${MODULES}
	@@echo "Building" ${JQ}

	@@mkdir -p ${DIST_DIR}
	@@cat ${MODULES} | ${VER} > ${JQ};

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

	@@echo " - Removing ScriptDoc from" ${JQ}
	@@${JAR} ${BUILD_DIR}/build/lite.js ${JQ} ${JQ_LITE}

	@@echo ${JQ_LITE} "Built"
	@@echo

pack: ${JQ_PACK}

${JQ_PACK}: ${JQ}
	@@echo "Building" ${JQ_PACK}

	@@echo " - Compressing using Packer"
	@@${JAR} ${BUILD_DIR}/build/pack.js ${JQ} ${JQ_PACK}

	@@echo ${JQ_PACK} "Built"
	@@echo

test: ${JQ}
	@@echo "Building Test Suite"

	@@echo " - Making Test Suite Directory:" ${TEST_DIR}
	@@mkdir -p ${TEST_DIR}

	@@echo " - Removing any old tests"
	@@rm -f ${TEST_DIR}/tests/*

	@@echo " - Copying over script files."
	@@cp -fR ${BUILD_DIR}/test/data ${TEST_DIR}/data
	@@cp -f ${BUILD_DIR}/test/index.html ${TEST_DIR}

	@@echo " - Compiling Test Cases"
	@@${JAR} ${BUILD_DIR}/test/test.js ${JQ} ${TEST_DIR}

	@@echo "Test Suite Built"
	@@echo

docs: ${JQ}
	@@echo "Building Documentation"

	@@echo " - Making Documentation Directory:" ${DOCS_DIR}
	@@mkdir -p ${DOCS_DIR}
	@@mkdir -p ${DOCS_DIR}/data

	@@echo " - Copying over htaccess file."
	@@cp -fR ${BUILD_DIR}/docs/.htaccess ${DOCS_DIR}

	@@echo " - Copying over script files."
	@@cp -fR ${BUILD_DIR}/docs/js ${DOCS_DIR}/js

	@@echo " - Copying over style files."
	@@cp -fR ${BUILD_DIR}/docs/style ${DOCS_DIR}/style

	@@echo " - Extracting ScriptDoc from" ${JQ}
	@@${JAR} ${BUILD_DIR}/docs/docs.js ${JQ} ${DOCS_DIR}

	@@echo "Documentation Built"
	@@echo

clean:
	@@echo "Removing Distribution directory:" ${DIST_DIR}
	@@rm -rf ${DIST_DIR}

	@@echo "Removing Test Suite directory:" ${TEST_DIR}
	@@rm -rf ${TEST_DIR}

	@@echo "Removing Documentation directory:" ${DOCS_DIR}
	@@rm -rf ${DOCS_DIR}
