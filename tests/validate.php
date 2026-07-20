<?php

declare(strict_types=1);

$root = dirname(__DIR__);
$errors = [];
$assert = static function (bool $condition, string $message) use (&$errors): void {
    if (!$condition) {
        $errors[] = $message;
    }
};

$pages = [
    'index.html' => [
        'lang' => 'ru',
        'canonical' => 'https://green4.photo/exposure-triangle-trainer/',
    ],
    'uk/index.html' => [
        'lang' => 'uk',
        'canonical' => 'https://green4.photo/exposure-triangle-trainer/uk/',
    ],
];

foreach ($pages as $relative => $expected) {
    $html = file_get_contents($root . '/' . $relative);
    $assert($html !== false, "$relative can be read");
    if ($html === false) {
        continue;
    }

    $document = new DOMDocument();
    libxml_use_internal_errors(true);
    $document->loadHTML($html, LIBXML_NONET | LIBXML_NOWARNING);
    libxml_clear_errors();
    $xpath = new DOMXPath($document);

    $assert($document->documentElement?->getAttribute('lang') === $expected['lang'], "$relative has the correct language");
    $canonical = $xpath->query('//link[@rel="canonical"]')->item(0);
    $assert($canonical?->getAttribute('href') === $expected['canonical'], "$relative has the correct canonical URL");
    $assert($xpath->query('//link[@rel="alternate" and @hreflang="ru"]')->length === 1, "$relative has one RU alternate");
    $assert($xpath->query('//link[@rel="alternate" and @hreflang="uk"]')->length === 1, "$relative has one UA alternate");
    $assert($xpath->query('//link[@rel="alternate" and @hreflang="x-default"]')->length === 1, "$relative has one x-default alternate");
    $assert($xpath->query('//link[contains(@href,"assets/css/style.css")]')->length === 1, "$relative loads shared CSS");
    $assert($xpath->query('//script[contains(@src,"assets/js/trainer.js")]')->length === 1, "$relative loads shared JavaScript");
    $assert($xpath->query('//style')->length === 0, "$relative has no embedded stylesheet");
    $assert($xpath->query('//*[@style]')->length === 0, "$relative has no inline styles");
    $assert($xpath->query('//noscript')->length === 1, "$relative has a no-JavaScript message");
    $assert($xpath->query('//img[@width="1200" and @height="279"]')->length === 1, "$relative reserves logo dimensions");
    $assert($xpath->query('//*[@id="mode-training"]')->length === 1, "$relative contains training mode");

    $ids = [];
    foreach ($xpath->query('//*[@id]') as $node) {
        $id = $node->getAttribute('id');
        $assert(!isset($ids[$id]), "$relative has duplicate id '$id'");
        $ids[$id] = true;
    }

    foreach ($xpath->query('//script[@type="application/ld+json"]') as $node) {
        json_decode($node->textContent, true, flags: JSON_THROW_ON_ERROR);
    }
}

$css = file_get_contents($root . '/assets/css/style.css');
$javascript = file_get_contents($root . '/assets/js/trainer.js');
$assert($css !== false && str_contains($css, ':focus-visible'), 'Shared CSS contains keyboard focus styles');
$assert($css !== false && strrpos($css, '@media') > strpos($css, '.topbar'), 'Responsive rules follow base rules');
$assert($javascript !== false && str_contains($javascript, 'modeTraining'), 'Shared JavaScript contains training mode');
$assert($javascript !== false && str_contains($javascript, 'localStorage'), 'Shared JavaScript persists state');
$assert($javascript !== false && str_contains($javascript, 'URLSearchParams'), 'Shared JavaScript reads share links');
$assert($javascript !== false && str_contains($javascript, 'navigator.clipboard'), 'Shared JavaScript copies share links');

$seconds = static fn (string $value): float => str_contains($value, '/')
    ? (float) explode('/', $value)[0] / (float) explode('/', $value)[1]
    : (float) str_replace([',', '″'], ['.', ''], $value);
$exposure = static fn (array $settings): float =>
    $settings['i'] * $seconds($settings['s']) / ($settings['a'] ** 2);
$stops = static fn (array $first, array $second): float => log($exposure($second) / $exposure($first), 2);

$formulaCases = [
    [['a' => 4.0, 'i' => 100, 's' => '1/125'], ['a' => 5.6, 'i' => 200, 's' => '1/125']],
    [['a' => 8.0, 'i' => 400, 's' => '1/60'], ['a' => 8.0, 'i' => 200, 's' => '1/30']],
    [['a' => 2.8, 'i' => 100, 's' => '1/250'], ['a' => 4.0, 'i' => 100, 's' => '1/125']],
];
foreach ($formulaCases as $index => [$first, $second]) {
    $assert(abs($stops($first, $second)) < 0.12, 'Exposure compensation formula case ' . ($index + 1));
}

if ($errors !== []) {
    fwrite(STDERR, "Validation failed:\n- " . implode("\n- ", $errors) . "\n");
    exit(1);
}

echo "Validation passed for RU and UA pages, shared assets, SEO metadata, and exposure formulas.\n";
