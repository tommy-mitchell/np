import test from 'ava';
import {stripIndent} from 'common-tags';
import {_createFixture} from '../_helpers/stub-execa.js';
import {getTagVersionPrefix as originalGetTagVersionPrefix} from '../../source/util.js';
import {npmConfig, yarnConfig} from '../../source/package-manager/configs.js';

/** @type {ReturnType<typeof _createFixture<import('../../source/util.js')>>} */
const createFixture = _createFixture('../../source/util.js', import.meta.url);

test('returns tag prefix - npm', createFixture, [{
	command: 'npm config get tag-version-prefix',
	stdout: 'ver',
}], async ({t, testedModule: {getTagVersionPrefix}}) => {
	t.is(
		await getTagVersionPrefix(npmConfig),
		'ver',
	);
});

test('returns preId postfix - yarn', createFixture, [{
	command: 'yarn config get version-tag-prefix',
	stdout: 'ver',
}], async ({t, testedModule: {getTagVersionPrefix}}) => {
	t.is(
		await getTagVersionPrefix(yarnConfig),
		'ver',
	);
});

test('defaults to "v" when command fails', createFixture, [{
	command: 'npm config get tag-version-prefix',
	exitCode: 1,
}], async ({t, testedModule: {getTagVersionPrefix}}) => {
	t.is(
		await getTagVersionPrefix(npmConfig),
		'v',
	);
});

test('no options passed', async t => {
	await t.throwsAsync(
		originalGetTagVersionPrefix(),
		{
			message: stripIndent`
			Expected argument to be of type \`object\` but received type \`undefined\`
			Expected object to have keys \`["tagVersionPrefixCommand"]\`
		`,
		},
	);

	await t.throwsAsync(
		originalGetTagVersionPrefix({}),
		{message: 'Expected object to have keys `["tagVersionPrefixCommand"]`'},
	);
});
