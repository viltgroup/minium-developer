# Minium Automator

## Usage

```bash
minium-automator [options...] arguments...
```

## Options

| Option                   | Description
| ------------------------ | ----------------------------------------------
| `-b (--browser) BROWSER` | browser where scripts will be executed against                           (supported values: `chrome`, `ie`, `firefox`, `safari`, `opera`, `phantomjs`)
| `-f (--file) FILE`      | script file to run
| `-h (--help)`           | display this help and exit
| `-v (--version)`        | show version

## Arguments

| Description |
| ---------------------------------------------- |
| script instructions to run. if `--file` or `--dir` is passed, SCRIPT is always executed before, so you can set variables for script file execution |

## Examples

```bash
minium-automator --browser chrome --file main.js "user = { name : 'auser', password : 'apassword' }"
```

```
minium-automator --browser firefox --dir minium-task
```
