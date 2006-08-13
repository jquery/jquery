SRC_DIR = src
BUILD_DIR = build
DOCS_DIR = docs

MODULES = jquery event fx ajax
JQ = jquery-svn.js
JQ_PACK = jquery-svn.pack.js

all: ${JQ} ${JQ_PACK} docs

${JQ}: 
	@@echo "Building jquery-svn.js";

	@@for f in ${MODULES}; do \
		echo "Adding module:" $$f;\
		cat ${SRC_DIR}/$$f/$$f.js >> ${JQ};\
	done

	@@echo "jquery-svn.js built.";

${JQ_PACK}: ${JQ}
	@@echo "Building jquery-svn.pack.js";

	cd ${BUILD_DIR} && java -jar js.jar build.js ../${JQ} ../${JQ_PACK}

	@@echo "jquery-svn.pack.js built.";

test:

docs: ${JQ}
	@@echo "Building Documentation";
	cd ${BUILD_DIR} && java -jar js.jar docs.js ../${JQ} ../${DOCS_DIR}
	@@echo "Documentation built.";

clean:
	rm ${JQ}
