rpi-tool

work in progress, in sudo mode can write to SD card on macs 
`write` and `get` are only resources currently working (on mac)

Use at own risk

Usage:

  `rpi-tool [<resource>] <action> <param1> <param2> ...`

Lists all images currently available locally
  `rpi-tool list`

Runs the installation suite
  `rpi-tool install`

Downloads a direct download or torent of a image
  `rpi-tool get [link]`

Writes an image to an SD card
  `rpi-tool write [image]`

Options:
  --version, -v  print rpi version and exit                                        [string]
  --colors       --no-colors will disable output coloring                          [boolean]  [default: true]
  --confirm, -c  prevents rpi from asking before overwriting/removing things       [boolean]  [default: false]
  --raw          rpi will only output line-delimited raw JSON (useful for piping)  [boolean]
