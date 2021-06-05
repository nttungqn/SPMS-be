import head from './components/head';
import body from './components/body';

export default async (data) => `
<html>
${head}
${body(data)}

</html>
`;
