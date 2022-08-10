// https://artistic-herring-cc8.notion.site/Front-Back-dcb6551e63814eecbe86df6c3b3c384c

const initialStr = 'abcde';
//2 symb - 2^1 ['ab', 'a.b']
//3 symb - 2^2 ['abc', 'a.bc', 'ab.c', 'a.b.c'] [], [1], [2], [1, 2]
//4 symb - 2^3 ['abcd', 'a.bcd', 'ab.cd', 'abc.d', 'a.b.cd', 'ab.c.d', 'a.bc.d', 'a.b.c.d'] [], [1], [2] ,[3] ,[1,2], [2,3], [1,3], [1,2,3]

// recursive function for dots combinations

function getDotsCombinations(str, depth = 0, tempStr = '', outArr = []) {
    if (depth === str.length - 1) {
        outArr.push(tempStr + str[str.length - 1]);
        return;
    }
    const curr = str[depth];
    getDotsCombinations(str, depth + 1, tempStr + curr + '.', outArr);
    getDotsCombinations(str, depth + 1, tempStr + curr, outArr);
    return outArr;
}

console.log(getDotsCombinations(initialStr));
