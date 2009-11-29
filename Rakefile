# Basic Rakefile for building jQuery
files = [ "intro", "core", "data", "event", "support", "selector", "traversing", "attributes", "manipulation", "css", "ajax", "fx", "offset", "dimensions", "outro" ]

date = `git log -1 | grep Date: | sed 's/[^:]*: *//'`.gsub(/\n/, "")
version = `cat version.txt`.gsub(/\n/, "")

task :default => :jquery

task :jquery => [:selector] do
	sh "mkdir -p dist"

	sh "cat " + files.map {|file| "src/" + file + ".js"}.join(" ") +
		" | sed 's/Date:./&" + date + "/' | " +
		" sed s/@VERSION/" + version + "/ > dist/jquery2.js"
end

task :selector do
	sh "sed '/EXPOSE/r src/sizzle-jquery.js' src/sizzle/sizzle.js > src/selector.js"
end
