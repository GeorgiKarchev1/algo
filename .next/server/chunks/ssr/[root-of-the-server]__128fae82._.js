module.exports = {

"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)": (function(__turbopack_context__) {

var { g: global, __dirname, m: module, e: exports } = __turbopack_context__;
{
const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}}),
"[project]/src/components/ui/AnimatedBackground.tsx [app-ssr] (ecmascript)": ((__turbopack_context__) => {
"use strict";

var { g: global, __dirname } = __turbopack_context__;
{
__turbopack_context__.s({
    "default": (()=>AnimatedBackground)
});
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react-jsx-dev-runtime.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/dist/server/route-modules/app-page/vendored/ssr/react.js [app-ssr] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/framer-motion/dist/es/render/components/motion/proxy.mjs [app-ssr] (ecmascript)");
'use client';
;
;
;
const codeSnippets = [
    'O(log n)',
    'if (true) {',
    'return 42;',
    '[1,2,3]',
    'while(lazy)',
    'sort()',
    'find()',
    'push()',
    '//TODO',
    'null',
    'async',
    'const',
    '===',
    '!==',
    '{}',
    '[]',
    'map()',
    'filter()',
    'reduce()',
    'setTimeout'
];
const FloatingElement = ({ children, delay = 0, duration = 20, className = "" })=>{
    const [windowDimensions, setWindowDimensions] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useState({
        width: 1200,
        height: 800
    });
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useEffect(()=>{
        setWindowDimensions({
            width: window.innerWidth,
            height: window.innerHeight
        });
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
        className: `absolute text-primary-500/20 font-mono text-sm select-none pointer-events-none ${className}`,
        initial: {
            x: '-100px',
            y: Math.random() * windowDimensions.height,
            opacity: 0,
            rotate: Math.random() * 360
        },
        animate: {
            x: windowDimensions.width + 100,
            y: Math.random() * windowDimensions.height,
            opacity: [
                0,
                0.7,
                0.7,
                0
            ],
            rotate: Math.random() * 360 + 180
        },
        transition: {
            duration,
            delay,
            repeat: Infinity,
            ease: "linear"
        },
        children: children
    }, void 0, false, {
        fileName: "[project]/src/components/ui/AnimatedBackground.tsx",
        lineNumber: 42,
        columnNumber: 5
    }, this);
};
const GeometricShape = ({ delay = 0, size = 40 })=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
        className: "absolute rounded-full bg-gradient-to-br from-secondary-500/10 to-accent-500/10 blur-sm",
        style: {
            width: size,
            height: size,
            left: Math.random() * 100 + '%',
            top: Math.random() * 100 + '%'
        },
        animate: {
            scale: [
                1,
                1.2,
                0.8,
                1
            ],
            rotate: [
                0,
                180,
                360
            ],
            opacity: [
                0.3,
                0.6,
                0.3
            ]
        },
        transition: {
            duration: 8 + Math.random() * 4,
            delay,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }, void 0, false, {
        fileName: "[project]/src/components/ui/AnimatedBackground.tsx",
        lineNumber: 69,
        columnNumber: 3
    }, this);
const BinaryRain = ({ delay = 0 })=>{
    const [windowDimensions, setWindowDimensions] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useState({
        width: 1200,
        height: 800
    });
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useEffect(()=>{
        setWindowDimensions({
            width: window.innerWidth,
            height: window.innerHeight
        });
    }, []);
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
        className: "absolute text-primary-400/10 font-mono text-xs select-none pointer-events-none",
        initial: {
            x: Math.random() * windowDimensions.width,
            y: -50,
            opacity: 0
        },
        animate: {
            y: windowDimensions.height + 50,
            opacity: [
                0,
                0.5,
                0
            ]
        },
        transition: {
            duration: 15 + Math.random() * 10,
            delay,
            repeat: Infinity,
            ease: "linear"
        },
        children: Array.from({
            length: 20
        }, (_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "mb-2",
                children: Math.random() > 0.5 ? '1' : '0'
            }, i, false, {
                fileName: "[project]/src/components/ui/AnimatedBackground.tsx",
                lineNumber: 118,
                columnNumber: 9
            }, this))
    }, void 0, false, {
        fileName: "[project]/src/components/ui/AnimatedBackground.tsx",
        lineNumber: 99,
        columnNumber: 5
    }, this);
};
function AnimatedBackground() {
    const [mounted, setMounted] = __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useState(false);
    __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["default"].useEffect(()=>{
        setMounted(true);
    }, []);
    if (!mounted) return null;
    return /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
        className: "fixed inset-0 overflow-hidden pointer-events-none z-0",
        children: [
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                className: "absolute inset-0 opacity-30",
                animate: {
                    background: [
                        'radial-gradient(circle at 20% 20%, rgba(56, 189, 248, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)',
                        'radial-gradient(circle at 80% 20%, rgba(168, 85, 247, 0.1) 0%, transparent 50%), radial-gradient(circle at 20% 80%, rgba(20, 184, 166, 0.1) 0%, transparent 50%)',
                        'radial-gradient(circle at 50% 50%, rgba(20, 184, 166, 0.1) 0%, transparent 50%), radial-gradient(circle at 0% 100%, rgba(56, 189, 248, 0.1) 0%, transparent 50%)',
                        'radial-gradient(circle at 20% 20%, rgba(56, 189, 248, 0.1) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(168, 85, 247, 0.1) 0%, transparent 50%)'
                    ]
                },
                transition: {
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }
            }, void 0, false, {
                fileName: "[project]/src/components/ui/AnimatedBackground.tsx",
                lineNumber: 138,
                columnNumber: 7
            }, this),
            codeSnippets.map((snippet, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(FloatingElement, {
                    delay: index * 2,
                    duration: 25 + Math.random() * 10,
                    className: "text-xs md:text-sm",
                    children: snippet
                }, `code-${index}`, false, {
                    fileName: "[project]/src/components/ui/AnimatedBackground.tsx",
                    lineNumber: 157,
                    columnNumber: 9
                }, this)),
            Array.from({
                length: 8
            }, (_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(GeometricShape, {
                    delay: i * 3,
                    size: 30 + Math.random() * 40
                }, `shape-${i}`, false, {
                    fileName: "[project]/src/components/ui/AnimatedBackground.tsx",
                    lineNumber: 169,
                    columnNumber: 9
                }, this)),
            Array.from({
                length: 5
            }, (_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(BinaryRain, {
                    delay: i * 8
                }, `binary-${i}`, false, {
                    fileName: "[project]/src/components/ui/AnimatedBackground.tsx",
                    lineNumber: 178,
                    columnNumber: 9
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])("div", {
                className: "absolute bottom-0 left-0 w-full h-32 opacity-20",
                children: Array.from({
                    length: 50
                }, (_, i)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                        className: "inline-block w-2 bg-gradient-to-t from-primary-500 to-secondary-500 mr-1",
                        style: {
                            height: Math.random() * 100 + 20
                        },
                        animate: {
                            height: [
                                Math.random() * 100 + 20,
                                Math.random() * 100 + 20,
                                Math.random() * 100 + 20
                            ],
                            opacity: [
                                0.3,
                                0.7,
                                0.3
                            ]
                        },
                        transition: {
                            duration: 3 + Math.random() * 2,
                            delay: i * 0.1,
                            repeat: Infinity,
                            ease: "easeInOut"
                        }
                    }, `bar-${i}`, false, {
                        fileName: "[project]/src/components/ui/AnimatedBackground.tsx",
                        lineNumber: 184,
                        columnNumber: 11
                    }, this))
            }, void 0, false, {
                fileName: "[project]/src/components/ui/AnimatedBackground.tsx",
                lineNumber: 182,
                columnNumber: 7
            }, this),
            [
                '∑',
                '∞',
                'π',
                '√',
                '∫',
                '∆',
                'λ',
                'Ω'
            ].map((symbol, index)=>/*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                    className: "absolute text-accent-500/20 text-2xl font-bold select-none pointer-events-none",
                    style: {
                        left: Math.random() * 100 + '%',
                        top: Math.random() * 100 + '%'
                    },
                    animate: {
                        y: [
                            0,
                            -20,
                            0
                        ],
                        rotate: [
                            0,
                            360
                        ],
                        opacity: [
                            0.2,
                            0.5,
                            0.2
                        ],
                        scale: [
                            1,
                            1.2,
                            1
                        ]
                    },
                    transition: {
                        duration: 8 + Math.random() * 4,
                        delay: index * 2,
                        repeat: Infinity,
                        ease: "easeInOut"
                    },
                    children: symbol
                }, `math-${index}`, false, {
                    fileName: "[project]/src/components/ui/AnimatedBackground.tsx",
                    lineNumber: 208,
                    columnNumber: 9
                }, this)),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                className: "absolute w-4 h-4 bg-primary-500/30 rounded-full blur-sm",
                animate: {
                    x: [
                        100,
                        1100,
                        100
                    ],
                    y: [
                        100,
                        700,
                        100
                    ]
                },
                transition: {
                    duration: 30,
                    repeat: Infinity,
                    ease: "linear"
                }
            }, void 0, false, {
                fileName: "[project]/src/components/ui/AnimatedBackground.tsx",
                lineNumber: 233,
                columnNumber: 7
            }, this),
            /*#__PURE__*/ (0, __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$dist$2f$server$2f$route$2d$modules$2f$app$2d$page$2f$vendored$2f$ssr$2f$react$2d$jsx$2d$dev$2d$runtime$2e$js__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["jsxDEV"])(__TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$framer$2d$motion$2f$dist$2f$es$2f$render$2f$components$2f$motion$2f$proxy$2e$mjs__$5b$app$2d$ssr$5d$__$28$ecmascript$29$__["motion"].div, {
                className: "absolute inset-0 opacity-5",
                style: {
                    backgroundImage: 'linear-gradient(rgba(56, 189, 248, 0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(56, 189, 248, 0.1) 1px, transparent 1px)',
                    backgroundSize: '50px 50px'
                },
                animate: {
                    backgroundPosition: [
                        '0px 0px',
                        '50px 50px',
                        '0px 0px'
                    ]
                },
                transition: {
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear"
                }
            }, void 0, false, {
                fileName: "[project]/src/components/ui/AnimatedBackground.tsx",
                lineNumber: 247,
                columnNumber: 7
            }, this)
        ]
    }, void 0, true, {
        fileName: "[project]/src/components/ui/AnimatedBackground.tsx",
        lineNumber: 136,
        columnNumber: 5
    }, this);
}
}}),

};

//# sourceMappingURL=%5Broot-of-the-server%5D__128fae82._.js.map