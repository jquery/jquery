SRC_DIR = src
BUILD_DIR = build

DOCS_DIR = docs
DIST_DIR = dist

MODULES = jquery event fx ajax
JQ = ${DIST_DIR}/jquery.js
JQ_LITE = ${DIST_DIR}/jquery.lite.js
JQ_PACK = ${DIST_DIR}/jquery.pack.js

all: jquery lite pack docs

${DIST_DIR}:
	mkdir -p ${DIST_DIR}

jquery: ${DIST_DIR} ${JQ}

${JQ}:
	@@echo "Building" ${JQ};

	@@for f in ${MODULES}; do \
		echo "Adding module:" $$f;\
		cat ${SRC_DIR}/$$f/$$f.js >> ${JQ};\
	done

	@@echo ${JQ} "built.";

lite: ${JQ_LITE}

${JQ_LITE}: ${JQ}
	@@echo "Building" ${JQ_LITE};
	java -jar ${BUILD_DIR}/js.jar ${BUILD_DIR}/lite.js ${JQ} ${JQ_LITE}
	@@echo ${JQ_LITE} "built.";

pack: ${JQ_PACK}

${JQ_PACK}: ${JQ}
	@@echo "Building" ${JQ_PACK};
	java -jar ${BUILD_DIR}/js.jar ${BUILD_DIR}/build.js ${JQ} ${JQ_PACK}
	@@echo ${JQ_PACK} "built.";

test:

docs: ${JQ}
	@@echo "Building Documentation";
	java -jar ${BUILD_DIR}/js.jar ${BUILD_DIR}/docs.js ${JQ} ${DOCS_DIR}
	@@echo "Documentation built.";

clean:
	rm -rf ${DIST_DIR}
	rm -f ${DOCS_DIR}/index.xml
	rm -f ${DOCS_DIR}/data/*
