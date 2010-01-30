SRC_DIR = src
BUILD_DIR = build

PREFIX = .
DIST_DIR = ${PREFIX}/dist

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

JQ_VER = `cat version.txt`
VER = sed s/@VERSION/${JQ_VER}/

MINJAR = java -jar ${BUILD_DIR}/google-compiler-20091218.jar

DATE=`git log -1 | grep Date: | sed 's/[^:]*: *//'`

all: jquery min
	@@echo "jQuery build complete."

${DIST_DIR}:
	@@mkdir -p ${DIST_DIR}

init:
	@@echo "Grabbing external dependencies..."
	@@if test ! -d test/qunit/.git; then git clone git://github.com/jquery/qunit.git test/qunit; fi
	@@if test ! -d src/sizzle/.git; then git clone git://github.com/jeresig/sizzle.git src/sizzle; fi
	@@cd src/sizzle && git pull origin master > /dev/null 2>&1
	@@cd test/qunit && git pull origin master > /dev/null 2>&1

jquery: ${DIST_DIR} selector ${JQ}
jq: ${DIST_DIR} ${JQ}

${JQ}: ${MODULES}
	@@echo "Building" ${JQ}

	@@mkdir -p ${DIST_DIR}

	@@cat ${MODULES} | \
		sed 's/Date:./&'"${DATE}"'/' | \
		${VER} > ${JQ};

selector: init
	@@echo "Building selector code from Sizzle"
	@@sed '/EXPOSE/r src/sizzle-jquery.js' src/sizzle/sizzle.js > src/selector.js

min: ${JQ_MIN}

${JQ_MIN}: ${JQ}
	@@echo "Building" ${JQ_MIN}

	@@head -15 ${JQ} > ${JQ_MIN}
	@@${MINJAR} --js ${JQ} --warning_level QUIET >> ${JQ_MIN}

clean:
	@@echo "Removing Distribution directory:" ${DIST_DIR}
	@@rm -rf ${DIST_DIR}

	@@echo "Removing built copy of Sizzle"
	@@rm src/selector.js

	@@echo "Removing cloned directories"
	@@rm -rf test/qunit src/sizzle
