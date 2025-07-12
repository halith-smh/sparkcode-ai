import prettier from 'prettier';


export const getFileType = (fileName) => {
    const fileExtension = fileName.split('.').pop();
    const languageMap = {
        'js': 'javascript',
        'jsx': 'javascript',
        'ts': 'typescript',
        'tsx': 'typescript',
        'html': 'html',
        'css': 'css',
        'json': 'json',
        'md': 'markdown'
    };
    return languageMap[fileExtension] || 'plaintext';
}

// export const formatCode = async (value, type) => {
//     const formattedCode = await prettier.format(code, {
//         parser: "typescript",
//         semi: true,
//         singleQuote: true,
//         tabWidth: 2,
//     });
// }