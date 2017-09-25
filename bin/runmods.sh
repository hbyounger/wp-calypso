#!/bin/bash

# Uncomment the following lines to print commands as they are executed
# set -o xtrace

set -o errexit
set -o nounset

# Initialize from the provided arguments
TARGET="${1:?No target supplied. Please provide a target directory or file.}"

# Codemods to be run in sequence
MODS=(
  'commonjs-imports-hoist'
  'commonjs-imports'
  'commonjs-exports'
  'i18n-mixin'
  'react-create-class'
  'react-prop-types'
  'sort-imports'
  # 'combine-reducer-with-persistence'
  # 'combine-state-utils-imports'
  # 'merge-lodash-imports'
  # 'modular-lodash-no-more'
  # 'named-exports-from-default'
  # 'rename-combine-reducers'
)

for MOD in "${MODS[@]}"; do
	echo
	echo "Running $MOD on $TARGET"
	echo

	"./bin/codemods/$MOD" $TARGET

	# sort-imports needs to be run twice sometimes
	# see https://github.com/Automattic/wp-calypso/pull/18070
	if [[ $MOD == 'sort-imports' ]]; then
		"./bin/codemods/$MOD" $TARGET
	fi

	# Check for changes
	if [[ -n "$( git diff --name-only )" ]]; then
		# Try to fix lint issues (but don't fail on lint errors)
		"./node_modules/.bin/eslint-eslines" --fix "$TARGET" -- --diff=index || true

		# Add anything that was modded
		git add $TARGET

		# Commit! (skip pre-commit checks)
		git commit -nm "Apply codemod $MOD"
	fi
done
