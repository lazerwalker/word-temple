//
//  ViewController.swift
//  Word Temple
//
//  Created by Mike Lazer-Walker on 04.08.18.
//  Copyright © 2018 Mike Lazer-Walker. All rights reserved.
//

import UIKit
import WebKit

class ViewController: UIViewController {
    @IBOutlet weak var webView: WKWebView!
    @IBOutlet weak var tabBar: UITabBar!

    override func viewDidLoad() {
        super.viewDidLoad()

        webView.uiDelegate = self
        webView.navigationDelegate = self

        webView.scrollView.isScrollEnabled = false

        loadFirebase()
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    private func loadFirebase() {
        guard let url = URL(string: "http://word-temple.firebaseapp.com") else { return }
        loadURL(url: url)
    }

    private func loadMacBook() {
        guard let url = URL(string: "http://ono-sendai.local:3000") else { return }
        loadURL(url: url)
    }

    private func loadLocal() {
        guard let url = URL(string: "http://word-temple.firebaseapp.com") else { return }
        loadURL(url: url)
    }

    private func loadURL(url: URL) {
        let myRequest = URLRequest(url: url)
        webView.load(myRequest)
    }
}

extension ViewController: UITabBarDelegate {
    func tabBar(_ tabBar: UITabBar, didSelect item: UITabBarItem) {
        // TODO: Hah. See Storyboard for hardcoded tags.
        if (item.tag == 0) {
            loadFirebase()
        } else if (item.tag == 1) {
            loadMacBook()
        } else if (item.tag == 2) {
            loadLocal()
        }
    }
}

extension ViewController: WKUIDelegate {

}

extension ViewController: WKNavigationDelegate {
    func webView(_ webView: WKWebView, didFail navigation: WKNavigation!, withError error: Error) {
        print(error)
    }

    func webView(_ webView: WKWebView, didFailProvisionalNavigation navigation: WKNavigation!, withError error: Error) {
        print(error)
    }
}
