#!/usr/bin/env node

/**
 * External dependencies
 */
const fs = require( 'fs' );
const path = require( 'path' );
const child_process = require( 'child_process' );

/**
 * Internal dependencies
 */
const config = require( './src/config' );

function getLocalCodemodFileNames() {
	// Returns all JS files in bin/codemods/src folder, except for config and helpers.

	return fs.readdirSync( './bin/codemods/src' )
		.filter( name => name !== 'config.js' && name != 'helpers.js' ) // exclude utility files
		.filter( name => name[ 0 ] !== '.' ) // exclude dot files
		.filter( name => path.extname( name ) === '.js' ) // only include JS files
		.map( name => name.replace( '.js', '' ) ); // strip extension from filename
}

function getValidCodemodNames() {
	return [
		...getLocalCodemodFileNames(),
		...Object.getOwnPropertyNames( config.codemodArgs ),
	].map( name => '- ' + name ).sort();
}

function printableValidCodemodNames() {
	return getValidCodemodNames().join('\n');
}

function generateBinArgs( name ) {
	if ( config.codemodArgs.hasOwnProperty( name ) ) {
		// Is the codemod defined in the codemodArgs object?
		return config.codemodArgs[ name ];
	} else if ( getLocalCodemodFileNames().includes( name ) ) {
		// Is the codemod a local script defined in bin/codemods/src folder?
		return [
			`--transform=bin/codemods/src/${ name }.js`,
		];
	} else {
		throw new Error(
			`"${ name }" is an unrecognized codemod.`
		);
	}
}

function runCodemod() {
	const args = process.argv.slice( 2 );
	if ( args.length === 0 || args.length === 1 ) {
		process.stdout.write( '\n' );
		process.stdout.write( './bin/codemods/run.js [transformation name] [target(s)]\n' );
		process.stdout.write( '\n' );
		process.stdout.write( `Valid transformation names: \n${ printableValidCodemodNames() }\n` );
		process.stdout.write( '\n' );
		process.stdout.write( 'Example: "./bin/codemods/run.js commonjs-imports client/blocks client/devdocs"\n' );
		process.stdout.write( '\n' );
		process.exit( 0 );
	}

	const [ name, ...targets ] = args;
	const binArgs = [
		// jscodeshift options
		...config.jscodeshiftArgs,

		...generateBinArgs( name ),

		// Transform target
		...targets,
	];

	const binPath = path.join( '.', 'node_modules', '.bin', 'jscodeshift' );
	const jscodeshift = child_process.spawn( binPath, binArgs );

	jscodeshift.stdout.on( 'data', ( data ) => {
		process.stdout.write( data );
	} );

	jscodeshift.stderr.on( 'data', ( data ) => {
		process.stderr.write( data );
	} );
}

runCodemod()
