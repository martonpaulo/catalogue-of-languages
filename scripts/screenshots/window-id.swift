import CoreGraphics
import Foundation

// Prints the CGWindowID of the frontmost on-screen window owned by the given process.
//
// A browser cannot print its own window id the way a native app can, so the id is read from
// the window server and narrowed to the process this capture launched itself. Nothing owned
// by another application, or by another instance of the same browser, can match.
guard CommandLine.arguments.count == 2, let pid = Int(CommandLine.arguments[1]) else {
    FileHandle.standardError.write("usage: window-id.swift <pid>\n".data(using: .utf8)!)
    exit(2)
}

let options: CGWindowListOption = [.optionOnScreenOnly, .excludeDesktopElements]
guard let windows = CGWindowListCopyWindowInfo(options, kCGNullWindowID) as? [[String: Any]]
else {
    FileHandle.standardError.write("the window list is unavailable\n".data(using: .utf8)!)
    exit(1)
}

for window in windows {
    guard
        let owner = window[kCGWindowOwnerPID as String] as? Int, owner == pid,
        let layer = window[kCGWindowLayer as String] as? Int, layer == 0,
        let number = window[kCGWindowNumber as String] as? Int,
        let bounds = window[kCGWindowBounds as String] as? [String: Any],
        let height = bounds["Height"] as? Double, height > 200
    else { continue }

    print(number)
    exit(0)
}

FileHandle.standardError.write("no window found for pid \(pid)\n".data(using: .utf8)!)
exit(1)
