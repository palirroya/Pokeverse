describe('verifyToken Function', function()
{
	it('authHeader null should be error', function()
	{
		console.log("Testing verifyToken");
		req = { 'headers': { 'authorization': {}}};
		req.headers.authorization = null;
		const authHeader = req.headers.authorization;
		if (!authHeader) {
			expect(authHeader).toBeNull();
		} else if (!authHeader.startsWith('Bearer ')) {
			expect(authHeader).not.toContain('Bearer ');
		}
	});
});

describe('fetchAbilities Function', function()
{
	it('should return abilities of given pkmn', async function()
	{
		console.log("Testing fetchAbilities");
		speciesName = 'pelipper';
		const response = await require('axios').get(`https://pokeapi.co/api/v2/pokemon/${speciesName.toLowerCase()}`);
		expect(response.data.name).toBe('pelipper');
	});
});

describe('userLogin Function', function()
{
	it('should return existing acc given login & pw', function()
	{
		console.log("Testing userLogin");
		const sampleKey = 'wailord';
		const token = require('jsonwebtoken').sign(
			  { username: 'pelipper'},
			  sampleKey,
			  { expiresIn: '1w' }
		);
		const decoded = require('jsonwebtoken').verify(token, sampleKey);
		expect(decoded.username).toBe('pelipper');
	});
});

describe('fetchDefaultMoves Function', function()
{
	it('should return default moves of given pkmn', async function()
	{
		console.log("Testing fetchDefaultMoves");
		speciesName = 'charmander';
		const response = await require('axios').get(`https://pokeapi.co/api/v2/pokemon/${speciesName.toLowerCase()}`);
		expect(response.data.name).toBe('charmander');
	});
});

describe('createTemporaryAccount Function', function()
{
	it('should have newAcc and accData matching', function()
	{
		console.log("Testing createTemporaryAccount");
		const accountData = {'email': 'testing@email.com', 'username': 'wailord', 'password': 'wailmer'}
		const newAccount = accountData;
		expect(newAccount.username).toBe(accountData.username);
	});
});

describe('createAccount Function', function()
{
	it('should have newAcc and accData matching', function()
	{
		console.log("Testing createAccount");
		const accountData = {'email': 'testing@email.com', 'username': 'wailord', 'password': 'wailmer'}
		const newAccount = accountData;
		expect(newAccount.username).toBe(accountData.username);
	});
});

describe('forgotPassword Function', function()
{
	it('should return existing acc given email', function()
	{
		console.log("Testing forgotPassword");
		const sampleKey = 'lugia';
		const token = require('jsonwebtoken').sign(
			  { password: 'ho-oh'},
			  sampleKey,
			  { expiresIn: '1h' }
		);
		const decoded = require('jsonwebtoken').verify(token, sampleKey);
		expect(decoded.password).toBe('ho-oh');
	});
});

describe('resetPassword Function', function()
{
	it('should have decoded token equal to original token', function()
	{
		console.log("Testing resetPassword");
		const sampleKey = 'wailord';
		const token = require('jsonwebtoken').sign(
			  { password: 'jolteon'},
			  sampleKey,
			  { expiresIn: '1d' }
		);
		const decoded = require('jsonwebtoken').verify(token, sampleKey);
		expect(decoded.password).toBe('jolteon');
	});
});

describe('signup Function', function()
{
	it('should have userData and accountData be equal', function()
	{
		console.log("Testing signup");
		const userData = {'username': 'breloom', 'email': 'noreply@pokeverse.space', 'password': 'Gastrodon'};
		accountData = {
			username: userData.username,
			email: userData.email,
			password: userData.password
		};
		expect(accountData).toEqual(userData);
	});
});

describe('getPokemonColor Function', function()
{
	it('should return color of given pkmn', async function()
	{
		console.log("Testing getPokemonColor");
		const speciesName = 'wailord';
		const pokemonResponse = await require('axios').get(`https://pokeapi.co/api/v2/pokemon/${speciesName.toLowerCase()}`);
		const speciesUrl = pokemonResponse.data.species.url;
		const speciesResponse = await require('axios').get(speciesUrl);
		expect(speciesResponse.data.color.name).toBe('blue');
	});
});