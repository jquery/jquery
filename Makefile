
all: update_submodules

submoduleclean: clean
	@@echo "Removing submodules"
	@@rm -rf test/qunit src/sizzle

# change pointers for submodules and update them to what is specified in jQuery
# --merge	doesn't work when doing an initial clone, thus test if we have non-existing
#	submodules, then do an real update
update_submodules:
	@@if [ -d .git ]; then \
		if git submodule status | grep -q -E '^-'; then \
			git submodule update --init --recursive; \
		else \
			git submodule update --init --recursive --merge; \
		fi; \
	fi;

# update the submodules to the latest at the most logical branch
pull_submodules:
	@@git submodule foreach "git pull \$$(git config remote.origin.url)"
	#@@git submodule summary

.PHONY: all submoduleclean update_submodules pull_submodules
