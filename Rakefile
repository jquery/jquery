prefix    = File.dirname( __FILE__ )

# Directory variables
src_dir   = File.join( prefix, 'src' )
build_dir = File.join( prefix, 'build' )
test_dir  = File.join( prefix, 'test' )

# A different destination directory can be set by
# setting DIST_DIR before calling rake
dist_dir  = ENV['DIST_DIR'] || File.join( prefix, 'dist' )

base_files = %w{intro core support data queue attributes event selector traversing manipulation css ajax effects offset dimensions outro}.map { |js| File.join( src_dir, "#{js}.js" ) }

# Sizzle, QUnit and jQuery files/dirs
sizzle_dir = File.join( src_dir, "sizzle" )
sizzle     = File.join( sizzle_dir, "sizzle.js" )
selector   = File.join( src_dir, "selector.js" )

qunit_dir  = File.join( test_dir, "qunit" )
qunit      = File.join( qunit_dir, "qunit", "qunit.js" )

jq         = File.join( dist_dir, "jquery.js" )
jq_min     = File.join( dist_dir, "jquery.min.js" )

# General Variables
date       = `git log -1 | grep Date: | sed 's/[^:]*: *//'`.strip
version    = File.read( File.join( prefix, 'version.txt' ) ).strip

# Build tools
rhino      = "java -jar #{build_dir}/js.jar"
minfier    = "java -jar #{build_dir}/google-compiler-20091218.jar"

# Turn off output other than needed from `sh` and file commands
verbose(false) 


# Tasks
task :default => "jquery"

desc "Builds jQuery; Tests with JSLint; Minifies jQuery"
task :all => [:jquery, :lint, :min] do
  puts "jQuery build complete."
end

desc "Builds jQuery: jquery.js (Default task)"
task :jquery => [:selector, jq]

desc "Builds a minified version of jQuery: jquery.min.js"
task :min => jq_min


task :init => [sizzle, qunit] do
  puts "Updating SizzleJS with latest..."
	sh "cd #{sizzle_dir} && git pull origin master &> /dev/null"

  puts "Updating QUnit with latest..."
	sh "cd #{qunit_dir} &&  git pull origin master &> /dev/null"
end

desc "Removes dist folder, selector.js, and Sizzle/QUnit"
task :clean do
  puts "Removing Distribution directory: #{dist_dir}..." 
  rm_r dist_dir

  puts "Removing built copy of Sizzle..."
  rm_r selector

  puts "Removing cloned directories..."
  rm_r qunit_dir
  rm_r sizzle_dir
end

desc "Rebuilds selector.js from SizzleJS"
task :selector => [:init, selector]

desc "Tests built jquery.js against JSLint"
task :lint => jq do
  puts "Checking jQuery against JSLint..."
  sh "#{rhino} #{build_dir}/jslint-check.js"
end


# File and Directory Dependencies
directory dist_dir

file jq => [dist_dir, base_files].flatten do
  puts "Building jquery.js..."
  sh "cat #{base_files.join(' ')} | sed 's/Date:./&#{date}/' | sed s/@VERSION/#{version}/ > #{jq}"
end

file jq_min => jq do
  puts "Building jquery.min.js..."

  sh "head -15 #{jq} > #{jq_min}"
  sh "#{minfier} --js #{jq} --warning_level QUIET >> #{jq_min}"
end

file selector => [sizzle] do 
  puts "Building selector code from Sizzle..."
  sh "sed '/EXPOSE/r #{src_dir}/sizzle-jquery.js' #{sizzle} > #{selector}"
end

file sizzle do
  puts "Retrieving SizzleJS from Github..."
  sh "git clone git://github.com/jeresig/sizzle.git #{sizzle_dir}"
end

file qunit do
  puts "Retrieving SizzleJS from Github..."
  sh "git clone git://github.com/jquery/qunit.git #{qunit_dir}"
end
