import { Tonfig } from '../src/Tonfig';

const content = `
[a]
b = "hello"
`;

Tonfig.loadConfig(content).then(tonfig => {
    console.log(tonfig.get('a.b'));

    tonfig.set('b.c', 'hi');

    console.log(tonfig.get('b.c'));
});
