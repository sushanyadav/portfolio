# 1. How to add a new icon?

1. on Figma, right click on the icon you want to add and select "Copy as SVG"
2. Create a new file with the icon name
3. Use this snippet to create the icon:

```json
{
  "Add SVG wrapper": {
    "scope": "typescript, typescriptreact",
    "prefix": "svg",
    "description": "Add SVG wrapper",
    "body": [
      "import { ComponentPropsWithoutRef } from 'react';",
      "",
      "interface ${TM_FILENAME_BASE/(^|[-_])([a-z])/${2:/upcase}/g}Props extends ComponentPropsWithoutRef<'svg'> {}",
      "",
      "export const ${TM_FILENAME_BASE/(^|[-_])([a-z])/${2:/upcase}/g} = ({...props}: ${TM_FILENAME_BASE/(^|[-_])([a-z])/${2:/upcase}/g}Props) => {",
      "  return ( ${1:<></>} )",
      "};"
    ]
  }
}
```

4. Type "svg" to trigger the snippet and and paste the copied SVG markup
