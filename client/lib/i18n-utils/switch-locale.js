/**
 * External dependencies
 */
import request from 'superagent';
import i18n from 'i18n-calypso';
import debugFactory from 'debug';

/**
 * Internal dependencies
 */
import { isDefaultLocale } from './utils';

const debug = debugFactory( 'calypso:i18n' );

function languageFileUrl( localeSlug ) {
	var protocol = typeof window === 'undefined' ? 'https://' : '//'; // use a protocol-relative path in the browser
	return `${ protocol }widgets.wp.com/languages/calypso/${ localeSlug }.json`;
}

export default function switchLocale( localeSlug ) {
	if ( localeSlug === i18n.getLocaleSlug() ) {
		return Promise.resolve();
	}

	if ( isDefaultLocale( localeSlug ) ) {
		i18n.configure( { defaultLocaleSlug: localeSlug } );
		return Promise.resolve();
	}

	return request.get( languageFileUrl( localeSlug ) )
		.then(
			response => i18n.setLocale( response.body ),
			() => debug( 'Encountered an error loading locale file for ' + localeSlug + '. Falling back to English.' )
		);
}
