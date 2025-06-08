# jest-markdown-expandable-reporter Test Results

> **Started**: Sun, 08 Jun 2025 14:24:03 GMT

<center>
  
|Suites (2)|Tests (4)|
|:-:|:-:|
|![](https://img.shields.io/badge/Passed-1-green) | ![](https://img.shields.io/badge/Passed-2-green)|
|![](https://img.shields.io/badge/Failed-1-red) | ![](https://img.shields.io/badge/Failed-1-red)|
|![](https://img.shields.io/badge/Pending-0-lightgrey) | ![](https://img.shields.io/badge/Pending-1-orange)|

---

  <table>
    <thead>
      <tr>
        <th>sample.test.ts</th>
        <th></th>
        <th></th>
        <th>2.049</th>
      </tr>
    </thead>
    <tbody>
      <tr style="background-color: lightgreen; color: black">
        <td><strong>Sample</strong></td>
        <td><i>should pass</i></td>
        <td>passed</td>
        <td>0.029</td>
      </tr>
      <tr>
        <td colspan="4">
          <details>
            <summary>Console Logs</summary>
            <pre>
<code>console.log</code>
&nbsp;&nbsp;This should pass
&nbsp;&nbsp;at Object.&lt;anonymous&gt; (/home/samsike/Projects/jest-markdown-expand-reporter/src/__tests__/sample.test.ts:3:13)</pre>
          </details>
        </td>
      </tr>
      <tr style="background-color: pink; color: black">
        <td><strong>Sample</strong></td>
        <td><i>should fail</i></td>
        <td>failed</td>
        <td>0.004</td>
      </tr>
      <tr>
        <td colspan="4">
          <details>
            <summary>Console Logs</summary>
            <pre>
<code>console.log</code>
&nbsp;&nbsp;This should fail
&nbsp;&nbsp;at Object.&lt;anonymous&gt; (/home/samsike/Projects/jest-markdown-expand-reporter/src/__tests__/sample.test.ts:8:13)
<code>console.debug</code>
&nbsp;&nbsp;This should fail
&nbsp;&nbsp;at Object.&lt;anonymous&gt; (/home/samsike/Projects/jest-markdown-expand-reporter/src/__tests__/sample.test.ts:9:13)</pre>
          </details>
        </td>
      </tr>
      <tr>
        <td colspan="4">
          <details>
            <summary>Failure Messages</summary>
            <pre>Error: expect(received).toBe(expected) // Object.is equality

Expected: 3
Received: 2
at Object.&lt;anonymous&gt; (/home/samsike/Projects/jest-markdown-expand-reporter/src/**tests**/sample.test.ts:10:19)
at Promise.then.completed (/home/samsike/Projects/jest-markdown-expand-reporter/node_modules/jest-circus/build/utils.js:298:28)
at new Promise (&lt;anonymous&gt;)
at callAsyncCircusFn (/home/samsike/Projects/jest-markdown-expand-reporter/node_modules/jest-circus/build/utils.js:231:10)
at \_callCircusTest (/home/samsike/Projects/jest-markdown-expand-reporter/node_modules/jest-circus/build/run.js:316:40)
at processTicksAndRejections (node:internal/process/task_queues:95:5)
at \_runTest (/home/samsike/Projects/jest-markdown-expand-reporter/node_modules/jest-circus/build/run.js:252:3)
at \_runTestsForDescribeBlock (/home/samsike/Projects/jest-markdown-expand-reporter/node_modules/jest-circus/build/run.js:126:9)
at \_runTestsForDescribeBlock (/home/samsike/Projects/jest-markdown-expand-reporter/node_modules/jest-circus/build/run.js:121:9)
at run (/home/samsike/Projects/jest-markdown-expand-reporter/node_modules/jest-circus/build/run.js:71:3)
at runAndTransformResultsToJestFormat (/home/samsike/Projects/jest-markdown-expand-reporter/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapterInit.js:122:21)
at jestAdapter (/home/samsike/Projects/jest-markdown-expand-reporter/node_modules/jest-circus/build/legacy-code-todo-rewrite/jestAdapter.js:79:19)
at runTestInternal (/home/samsike/Projects/jest-markdown-expand-reporter/node_modules/jest-runner/build/runTest.js:367:16)
at runTest (/home/samsike/Projects/jest-markdown-expand-reporter/node_modules/jest-runner/build/runTest.js:444:34)
at Object.worker (/home/samsike/Projects/jest-markdown-expand-reporter/node_modules/jest-runner/build/testWorker.js:106:12)</pre>

</details>
</td>
</tr>
<tr style="background-color: lightyellow; color: black">
<td><strong>Sample</strong></td>
<td><i>should skip</i></td>
<td>pending</td>
<td>0.000</td>
</tr>
</tbody>

  </table>
  <table>
    <thead>
      <tr>
        <th>longTest.test.ts</th>
        <th></th>
        <th></th>
        <th>5.010</th>
      </tr>
    </thead>
    <tbody>
      <tr style="background-color: lightgreen; color: black">
        <td><strong>Long Test</strong></td>
        <td><i>should take a long time</i></td>
        <td>passed</td>
        <td>3.024</td>
      </tr>
      <tr>
        <td colspan="4">
          <details>
            <summary>Console Logs</summary>
            <pre>
<code>console.log</code>
&nbsp;&nbsp;This test takes a long time
&nbsp;&nbsp;at Object.&lt;anonymous&gt; (/home/samsike/Projects/jest-markdown-expand-reporter/src/__tests__/longTest.test.ts:9:13)
<code>console.log</code>
&nbsp;&nbsp;Finished sleeping
&nbsp;&nbsp;at Object.&lt;anonymous&gt; (/home/samsike/Projects/jest-markdown-expand-reporter/src/__tests__/longTest.test.ts:12:13)</pre>
          </details>
        </td>
      </tr>
    </tbody>
  </table>
</center>
