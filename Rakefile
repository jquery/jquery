# Basic Rakefile for building jQuery
files = [ "intro", "core", "suppport", "data", "queue", "event", "selector", "traversing", "attributes", "manipulation", "css", "ajax", "fx", "offset", "dimensions", "outro" ]

date = `git log -1 | grep Date: | sed 's/[^:]*: *//'`.gsub(/\n/, "")
version = `cat version.txt`.gsub(/\n/, "")

task :default => :jquery

task :init do
	sh "if test ! -d test/qunit; then git clone git://github.com/jquery/qunit.git test/qunit; fi"
	sh "if test ! -d src/sizzle; then git clone git://github.com/jeresig/sizzle.git src/sizzle; fi"
	sh "cd src/sizzle && git pull origin master &> /dev/null"
	sh "cd test/qunit && git pull origin master &> /dev/null"
end

task :jquery => [:init, :selector] do
	sh "mkdir -p dist"

	sh "cat " + files.map {|file| "src/" + file + ".js"}.join(" ") +
		" | sed 's/Date:./&" + date + "/' | " +
		" sed s/@VERSION/" + version + "/ > dist/jquery2.js"
end

task :selector do
	sh "sed '/EXPOSE/r src/sizzle-jquery.js' src/sizzle/sizzle.js > src/selector.js"
end
