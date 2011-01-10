prefix    = File.dirname( __FILE__ )

# Directory variables
src_dir   = File.join( prefix, 'src' )
build_dir = File.join( prefix, 'build' )
test_dir  = File.join( prefix, 'test' )

# A different destination directory can be set by
# setting DIST_DIR before calling rake
dist_dir  = ENV['DIST_DIR'] || File.join( prefix, 'dist' )

base_files = %w{
  intro
  core
  support
  data
  queue
  attributes
  event
  selector
  traversing
  manipulation
  css
  ajax
  ajax/jsonp
  ajax/script
  ajax/xhr
  effects
  offset
  dimensions
  outro
}.map { |js| File.join( src_dir, "#{js}.js" ) }

# Sizzle, QUnit and jQuery files/dirs
sizzle_dir = File.join( src_dir, "sizzle" )
sizzle     = File.join( sizzle_dir, "sizzle.js" )
selector   = File.join( src_dir, "selector.js" )

qunit_dir  = File.join( test_dir, "qunit" )
qunit      = File.join( qunit_dir, "qunit", "qunit.js" )

jq         = File.join( dist_dir, "jquery.js" )
jq_min     = File.join( dist_dir, "jquery.min.js" )

# General Variables
date       = `git log -1`[/^Date:\s+(.+)$/, 1]
version    = File.read( File.join( prefix, 'version.txt' ) ).strip

# Build tools
js_engine  = "node"
compiler   = "#{js_engine} #{build_dir}/uglify.js --unsafe"

# Turn off output other than needed from `sh` and file commands
verbose(false)

# Tasks
task :default => "all"

desc "Builds jQuery; Tests with JSLint; Minifies jQuery"
task :all => [:jquery, :lint, :min] do
  puts "jQuery build complete."
end

desc "Builds jQuery: jquery.js (Default task)"
task :jquery => [:selector, jq]

desc "Builds a minified version of jQuery: jquery.min.js"
task :min => jq_min


task :init => [sizzle, qunit] do
  sizzle_git = File.join(sizzle_dir, '.git')
  qunit_git  = File.join(qunit_dir,  '.git')

  puts "Updating SizzleJS with latest..."
	sh "git --git-dir=#{sizzle_git} pull -q origin master"

  puts "Updating QUnit with latest..."
	sh "git --git-dir=#{qunit_git} pull -q origin master"
end

desc "Removes dist folder, selector.js, and Sizzle/QUnit"
task :clean do
  puts "Removing Distribution directory: #{dist_dir}..."
  rm_rf dist_dir

  puts "Removing built copy of Sizzle..."
  rm_rf selector

  puts "Removing cloned directories..."
  rm_rf qunit_dir
  rm_rf sizzle_dir
end

desc "Rebuilds selector.js from SizzleJS"
task :selector => [:init, selector]

desc "Tests built jquery.js against JSLint"
task :lint => jq do
  puts "Checking jQuery against JSLint..."
  sh "#{js_engine} " + File.join(build_dir, 'jslint-check.js')
end


# File and Directory Dependencies
directory dist_dir

file jq => [dist_dir, base_files].flatten do
  puts "Building jquery.js..."

  File.open(jq, 'w') do |f|
    f.write cat(base_files).
      gsub(/@DATE/, date).
      gsub(/@VERSION/, version).
      gsub(/.function..jQuery...\{/, '').
      gsub(/\}...jQuery..;/, '')
  end
end

file jq_min => jq do
  puts "Building jquery.min.js..."

  sh "#{compiler} #{jq} > #{jq_min}"
end

file selector => [sizzle, :init] do
  puts "Building selector code from Sizzle..."

  File.open(selector, 'w') do |f|
    f.write File.read(sizzle).gsub(
      /^.+EXPOSE$\n/,
      '\0' + File.read( File.join( src_dir, 'sizzle-jquery.js' ))
    ).gsub(
      /^window.Sizzle.+$\n/, ''
    )
  end
end

file sizzle do
  puts "Retrieving SizzleJS from Github..."
  sh "git clone git://github.com/jeresig/sizzle.git #{sizzle_dir}"
end

file qunit do
  puts "Retrieving QUnit from Github..."
  sh "git clone git://github.com/jquery/qunit.git #{qunit_dir}"
end


def cat( files )
  files.map do |file|
    File.read(file)
  end.join('')
end
