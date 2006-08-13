SRC_DIR = src
BUILD_DIR = build

PREFIX = .
DOCS_DIR = ${PREFIX}/docs
TEST_DIR = ${PREFIX}/test
DIST_DIR = ${PREFIX}/dist

MODULES = jquery event fx ajax
JQ = ${DIST_DIR}/jquery.js
JQ_LITE = ${DIST_DIR}/jquery.lite.js
JQ_PACK = ${DIST_DIR}/jquery.pack.js

all: jquery lite pack docs
	@@echo "jQuery build complete."

${DIST_DIR}:
	@@mkdir -p ${DIST_DIR}

jquery: ${DIST_DIR} ${JQ}

${JQ}:
	@@echo "Building" ${JQ}

	@@for f in ${MODULES}; do \
		echo " - Adding module:" $$f;\
		cat ${SRC_DIR}/$$f/$$f.js >> ${JQ};\
	done

	@@echo ${JQ} "built."
	@@echo

lite: ${JQ_LITE}

${JQ_LITE}: jquery
	@@echo "Building" ${JQ_LITE}
	@@echo " - Removing ScriptDoc from" ${JQ}
	@@java -jar ${BUILD_DIR}/js.jar ${BUILD_DIR}/lite.js ${JQ} ${JQ_LITE}
	@@echo ${JQ_LITE} "built."
	@@echo

pack: ${JQ_PACK}

${JQ_PACK}: jquery
	@@echo "Building" ${JQ_PACK}
	@@echo " - Compressing using Packer"
	@@java -jar ${BUILD_DIR}/js.jar ${BUILD_DIR}/build.js ${JQ} ${JQ_PACK}
	@@echo ${JQ_PACK} "built."
	@@echo

test: ${JQ}

docs: ${JQ}
	@@echo "Building Documentation"

	@@echo " - Making Documentation Directory:" ${DOCS_DIR}
	@@mkdir -p ${DOCS_DIR}
	@@mkdir -p ${DOCS_DIR}/data

	@@echo " - Copying over script files."
	@@cp -R ${BUILD_DIR}/docs/js ${DOCS_DIR}/js

	@@echo " - Copying over style files."
	@@cp -R ${BUILD_DIR}/docs/style ${DOCS_DIR}/style

	@@echo " - Extracting ScriptDoc from" ${JQ}
	@@java -jar ${BUILD_DIR}/js.jar ${BUILD_DIR}/docs.js ${JQ} ${DOCS_DIR}

	@@echo "Documentation built."
	@@echo

clean:
	@@rm -rf ${DIST_DIR}
	@@rm -rf ${DOCS_DIR}
