
# jest-markdown-expand-reporter Test Summary

> **Started**: <generated>

<center>
  
|Suites (1)|Tests (4)|
|:-:|:-:|
|![](https://img.shields.io/badge/Passed-0-lightgrey) | ![](https://img.shields.io/badge/Passed-1-green)|
|![](https://img.shields.io/badge/Failed-1-red) | ![](https://img.shields.io/badge/Failed-2-red)|
|![](https://img.shields.io/badge/Pending-0-lightgrey) | ![](https://img.shields.io/badge/Pending-1-orange)|

---

  ## Failed Tests
  <table>
  <thead>
    <tr>
      <th>sample.test.ts</th>
      <th></th>
      <th></th>
      <th><duration></th>
        <th>Jump to Test</th>
    </tr>
  </thead>
  <tbody>
    <tr style="background-color: pink; color: black" >
      <td><strong>Sample</strong></td>
      <td><i>should fail</i></td>
      <td>failed</td>
      <td><duration></td>
        <td><a href="#sample-should-fail">Jump to Test</a></td>    </tr>
    <tr>
      <td colspan="5">
        <details>
          <summary>Console Logs</summary>
          <pre>
<code>console.log</code>
&nbsp;&nbsp;This should fail {
name: &#39;Sample&#39;,
description: &#39;This is a sample test&#39;,
details: {
info: &#39;This is some additional information&#39;,
timestamp: &#39;<timestamp>&#39;
}
}
&nbsp;&nbsp;at Object.&lt;anonymous&gt; (<workspace>/src/__tests__/sample.test.ts:19:13)
<code>console.debug</code>
&nbsp;&nbsp;Test stringify object {&#34;name&#34;:&#34;Sample&#34;,&#34;description&#34;:&#34;This is a sample test&#34;,&#34;details&#34;:{&#34;info&#34;:&#34;This is some additional information&#34;,&#34;timestamp&#34;:&#34;<timestamp>&#34;}}
&nbsp;&nbsp;at Object.&lt;anonymous&gt; (<workspace>/src/__tests__/sample.test.ts:20:13)
<code>console.debug</code>
&nbsp;&nbsp;Test stringify(,null,2) obj {
&#34;name&#34;: &#34;Sample&#34;,
&#34;description&#34;: &#34;This is a sample test&#34;,
&#34;details&#34;: {
&#34;info&#34;: &#34;This is some additional information&#34;,
&#34;timestamp&#34;: &#34;<timestamp>&#34;
}
}
&nbsp;&nbsp;at Object.&lt;anonymous&gt; (<workspace>/src/__tests__/sample.test.ts:21:13)</pre>
        </details>
      </td>
    </tr>
    <tr>
      <td colspan="5">
        <details>
          <summary>Failure Messages</summary>

```diff
Error: expect(received).toBe(expected) // Object.is equality

Expected: 3
Received: 2
    at Object.<anonymous> (<workspace>/src/__tests__/sample.test.ts:22:19)
    at Promise.then.completed (<workspace>/node_modules/jest-circus/build/utils.js:298:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (<workspace>/node_modules/jest-circus/build/utils.js:231:10)
    at _callCircusTest (<workspace>/node_modules/jest-circus/build/run.js:316:40)
    at _runTest (<workspace>/node_modules/jest-circus/build/run.js:252:3)
    at _runTestsForDescribeBlock (<workspace>/node_modules/jest-circus/build/run.js:126:9)
    at _runTestsForDescribeBlock (<workspace>/node_modules/jest-circus/build/run.js:121:9)
    at run (<workspace>/node_modules/jest-circus/build/run.js:71:3)
    at runAndTransformResultsToJestFormat (<workspace>/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:122:21)
    at jestAdapter (<workspace>/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:79:19)
    at runTestInternal (<workspace>/node_modules/jest-runner/build/runTest.js:367:16)
    at runTest (<workspace>/node_modules/jest-runner/build/runTest.js:444:34)
```
</details>
      </td>
    </tr>
    <tr style="background-color: pink; color: black" >
      <td><strong>Sample</strong></td>
      <td><i>should expect different object</i></td>
      <td>failed</td>
      <td><duration></td>
        <td><a href="#sample-should-expect-different-object">Jump to Test</a></td>    </tr>
    <tr>
      <td colspan="5">
        <details>
          <summary>Console Logs</summary>
          <pre>
<code>console.log</code>
&nbsp;&nbsp;This should expect different object {
name: &#39;Sample&#39;,
description: &#39;This is a sample test&#39;,
details: {
info: &#39;This is some additional information&#39;,
date: &#39;<timestamp>&#39;
}
}
&nbsp;&nbsp;at Object.&lt;anonymous&gt; (<workspace>/src/__tests__/sample.test.ts:41:13)</pre>
        </details>
      </td>
    </tr>
    <tr>
      <td colspan="5">
        <details>
          <summary>Failure Messages</summary>

```diff
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 1

  Object {
    "description": "This is a sample test",
    "details": Object {
-     "date": "<timestamp>",
      "info": "This is some additional information",
+     "timestamp": "<timestamp>",
    },
    "name": "Sample",
  }
    at Object.<anonymous> (<workspace>/src/__tests__/sample.test.ts:42:17)
    at Promise.then.completed (<workspace>/node_modules/jest-circus/build/utils.js:298:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (<workspace>/node_modules/jest-circus/build/utils.js:231:10)
    at _callCircusTest (<workspace>/node_modules/jest-circus/build/run.js:316:40)
    at _runTest (<workspace>/node_modules/jest-circus/build/run.js:252:3)
    at _runTestsForDescribeBlock (<workspace>/node_modules/jest-circus/build/run.js:126:9)
    at _runTestsForDescribeBlock (<workspace>/node_modules/jest-circus/build/run.js:121:9)
    at run (<workspace>/node_modules/jest-circus/build/run.js:71:3)
    at runAndTransformResultsToJestFormat (<workspace>/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:122:21)
    at jestAdapter (<workspace>/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:79:19)
    at runTestInternal (<workspace>/node_modules/jest-runner/build/runTest.js:367:16)
    at runTest (<workspace>/node_modules/jest-runner/build/runTest.js:444:34)
```
</details>
      </td>
    </tr>
  </tbody>
</table>

</center>

---

# jest-markdown-expand-reporter Test Results

> **Started**: <generated>

<center>
  <table>
  <thead>
    <tr>
      <th>sample.test.ts</th>
      <th></th>
      <th></th>
      <th><duration></th>
    </tr>
  </thead>
  <tbody>
    <tr style="background-color: lightgreen; color: black"  id="sample-should-pass" >
      <td><strong>Sample</strong></td>
      <td><i>should pass</i></td>
      <td>passed</td>
      <td><duration></td>
    </tr>
    <tr>
      <td colspan="4">
        <details>
          <summary>Console Logs</summary>
          <pre>
<code>console.log</code>
&nbsp;&nbsp;This should pass {
name: &#39;Sample&#39;,
description: &#39;This is a sample test&#39;,
details: {
info: &#39;This is some additional information&#39;,
timestamp: &#39;<timestamp>&#39;
}
}
&nbsp;&nbsp;at Object.&lt;anonymous&gt; (<workspace>/src/__tests__/sample.test.ts:12:13)
<code>console.debug</code>
&nbsp;&nbsp;Test stringify object {&#34;name&#34;:&#34;Sample&#34;,&#34;description&#34;:&#34;This is a sample test&#34;,&#34;details&#34;:{&#34;info&#34;:&#34;This is some additional information&#34;,&#34;timestamp&#34;:&#34;<timestamp>&#34;}}
&nbsp;&nbsp;at Object.&lt;anonymous&gt; (<workspace>/src/__tests__/sample.test.ts:13:13)
<code>console.debug</code>
&nbsp;&nbsp;Test stringify(,null,2) obj {
&#34;name&#34;: &#34;Sample&#34;,
&#34;description&#34;: &#34;This is a sample test&#34;,
&#34;details&#34;: {
&#34;info&#34;: &#34;This is some additional information&#34;,
&#34;timestamp&#34;: &#34;<timestamp>&#34;
}
}
&nbsp;&nbsp;at Object.&lt;anonymous&gt; (<workspace>/src/__tests__/sample.test.ts:14:13)</pre>
        </details>
      </td>
    </tr>
    <tr style="background-color: pink; color: black"  id="sample-should-fail" >
      <td><strong>Sample</strong></td>
      <td><i>should fail</i></td>
      <td>failed</td>
      <td><duration></td>
    </tr>
    <tr>
      <td colspan="4">
        <details>
          <summary>Console Logs</summary>
          <pre>
<code>console.log</code>
&nbsp;&nbsp;This should fail {
name: &#39;Sample&#39;,
description: &#39;This is a sample test&#39;,
details: {
info: &#39;This is some additional information&#39;,
timestamp: &#39;<timestamp>&#39;
}
}
&nbsp;&nbsp;at Object.&lt;anonymous&gt; (<workspace>/src/__tests__/sample.test.ts:19:13)
<code>console.debug</code>
&nbsp;&nbsp;Test stringify object {&#34;name&#34;:&#34;Sample&#34;,&#34;description&#34;:&#34;This is a sample test&#34;,&#34;details&#34;:{&#34;info&#34;:&#34;This is some additional information&#34;,&#34;timestamp&#34;:&#34;<timestamp>&#34;}}
&nbsp;&nbsp;at Object.&lt;anonymous&gt; (<workspace>/src/__tests__/sample.test.ts:20:13)
<code>console.debug</code>
&nbsp;&nbsp;Test stringify(,null,2) obj {
&#34;name&#34;: &#34;Sample&#34;,
&#34;description&#34;: &#34;This is a sample test&#34;,
&#34;details&#34;: {
&#34;info&#34;: &#34;This is some additional information&#34;,
&#34;timestamp&#34;: &#34;<timestamp>&#34;
}
}
&nbsp;&nbsp;at Object.&lt;anonymous&gt; (<workspace>/src/__tests__/sample.test.ts:21:13)</pre>
        </details>
      </td>
    </tr>
    <tr>
      <td colspan="4">
        <details>
          <summary>Failure Messages</summary>

```diff
Error: expect(received).toBe(expected) // Object.is equality

Expected: 3
Received: 2
    at Object.<anonymous> (<workspace>/src/__tests__/sample.test.ts:22:19)
    at Promise.then.completed (<workspace>/node_modules/jest-circus/build/utils.js:298:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (<workspace>/node_modules/jest-circus/build/utils.js:231:10)
    at _callCircusTest (<workspace>/node_modules/jest-circus/build/run.js:316:40)
    at _runTest (<workspace>/node_modules/jest-circus/build/run.js:252:3)
    at _runTestsForDescribeBlock (<workspace>/node_modules/jest-circus/build/run.js:126:9)
    at _runTestsForDescribeBlock (<workspace>/node_modules/jest-circus/build/run.js:121:9)
    at run (<workspace>/node_modules/jest-circus/build/run.js:71:3)
    at runAndTransformResultsToJestFormat (<workspace>/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:122:21)
    at jestAdapter (<workspace>/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:79:19)
    at runTestInternal (<workspace>/node_modules/jest-runner/build/runTest.js:367:16)
    at runTest (<workspace>/node_modules/jest-runner/build/runTest.js:444:34)
```
</details>
      </td>
    </tr>
    <tr style="background-color: lightyellow; color: black"  id="sample-should-skip" >
      <td><strong>Sample</strong></td>
      <td><i>should skip</i></td>
      <td>pending</td>
      <td><duration></td>
    </tr>
    <tr style="background-color: pink; color: black"  id="sample-should-expect-different-object" >
      <td><strong>Sample</strong></td>
      <td><i>should expect different object</i></td>
      <td>failed</td>
      <td><duration></td>
    </tr>
    <tr>
      <td colspan="4">
        <details>
          <summary>Console Logs</summary>
          <pre>
<code>console.log</code>
&nbsp;&nbsp;This should expect different object {
name: &#39;Sample&#39;,
description: &#39;This is a sample test&#39;,
details: {
info: &#39;This is some additional information&#39;,
date: &#39;<timestamp>&#39;
}
}
&nbsp;&nbsp;at Object.&lt;anonymous&gt; (<workspace>/src/__tests__/sample.test.ts:41:13)</pre>
        </details>
      </td>
    </tr>
    <tr>
      <td colspan="4">
        <details>
          <summary>Failure Messages</summary>

```diff
Error: expect(received).toEqual(expected) // deep equality

- Expected  - 1
+ Received  + 1

  Object {
    "description": "This is a sample test",
    "details": Object {
-     "date": "<timestamp>",
      "info": "This is some additional information",
+     "timestamp": "<timestamp>",
    },
    "name": "Sample",
  }
    at Object.<anonymous> (<workspace>/src/__tests__/sample.test.ts:42:17)
    at Promise.then.completed (<workspace>/node_modules/jest-circus/build/utils.js:298:28)
    at new Promise (<anonymous>)
    at callAsyncCircusFn (<workspace>/node_modules/jest-circus/build/utils.js:231:10)
    at _callCircusTest (<workspace>/node_modules/jest-circus/build/run.js:316:40)
    at _runTest (<workspace>/node_modules/jest-circus/build/run.js:252:3)
    at _runTestsForDescribeBlock (<workspace>/node_modules/jest-circus/build/run.js:126:9)
    at _runTestsForDescribeBlock (<workspace>/node_modules/jest-circus/build/run.js:121:9)
    at run (<workspace>/node_modules/jest-circus/build/run.js:71:3)
    at runAndTransformResultsToJestFormat (<workspace>/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:122:21)
    at jestAdapter (<workspace>/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:79:19)
    at runTestInternal (<workspace>/node_modules/jest-runner/build/runTest.js:367:16)
    at runTest (<workspace>/node_modules/jest-runner/build/runTest.js:444:34)
```
</details>
      </td>
    </tr>
  </tbody>
</table>

</center>

