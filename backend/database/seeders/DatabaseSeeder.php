<?php

namespace Database\Seeders;

use App\Models\JournalEntry;
use App\Models\JournalImage;
use App\Models\JournalTag;
use App\Models\User;
use Carbon\Carbon;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        // 1. Create or update Demo User
        $user = User::updateOrCreate(
            ['email' => 'demo@example.com'],
            [
                'name' => 'Alex Morgan',
                'password' => Hash::make('password123'),
                'avatar' => null,
                'bio' => 'Writer, creator, and lifelong learner. Documenting daily reflections, ideas, and growth.',
                'settings' => [
                    'theme' => 'light',
                    'auto_save' => true,
                    'font_family' => 'sans',
                ],
            ]
        );

        // Clear existing entries for idempotent seeding
        $user->journalEntries()->delete();
        $user->tags()->delete();

        // 2. Create Tags
        $tagsData = [
            ['name' => 'Personal', 'color' => '#6366f1'],
            ['name' => 'Work', 'color' => '#3b82f6'],
            ['name' => 'Study', 'color' => '#8b5cf6'],
            ['name' => 'Travel', 'color' => '#06b6d4'],
            ['name' => 'Ideas', 'color' => '#ec4899'],
            ['name' => 'Goals', 'color' => '#10b981'],
            ['name' => 'Family', 'color' => '#f97316'],
            ['name' => 'Mindfulness', 'color' => '#eab308'],
        ];

        $tags = [];
        foreach ($tagsData as $t) {
            $tag = JournalTag::create([
                'user_id' => $user->id,
                'name' => $t['name'],
                'color' => $t['color'],
            ]);
            $tags[$t['name']] = $tag->id;
        }

        // Today reference
        $today = Carbon::parse('2026-10-06');

        // 3. Define 23 Realistic Journals
        $journals = [
            // 1. Classic - Today
            [
                'title' => 'Golden Hour Thoughts and Finding Clarity',
                'type' => 'classic',
                'mood' => 'calm',
                'mood_score' => 9,
                'journal_date' => $today->toDateString(),
                'is_favorite' => true,
                'is_draft' => false,
                'content' => "<p>The sun sank below the tree line today with an amber glow that filled the entire room. I sat with my warm mug of peppermint tea, breathing slowly, letting the rush of the early week subside.</p><p>It's fascinating how clarity rarely arrives when you chase it frantically; it slips in quietly the moment you step away from the noise and allow your mind to breathe.</p><p>Today reminded me to focus on single-tasking. When writing, just write. When listening, truly listen. Tomorrow I want to maintain this deliberate cadence.</p>",
                'data' => null,
                'tags' => ['Personal', 'Mindfulness'],
            ],
            // 2. Reflection - Yesterday (Oct 5)
            [
                'title' => 'Overcoming Architectural Friction in the Engine',
                'type' => 'reflection',
                'mood' => 'happy',
                'mood_score' => 8,
                'journal_date' => $today->copy()->subDays(1)->toDateString(),
                'is_favorite' => false,
                'is_draft' => false,
                'content' => "<p>A breakthrough day after two days of hitting a wall on decoupled events.</p>",
                'data' => [
                    'highlight' => 'Finally solved the race condition in the asynchronous queue listener. The pipeline runs silky smooth now.',
                    'challenges' => 'Debugging intermittent timeout issues across network hops took three hours of tcpdump analysis.',
                    'gratitude' => 'Grateful for David jumping into a quick huddle to review the state diagram with fresh eyes.',
                    'lessons' => 'Simpler contracts between modules always beat over-engineered abstractions.',
                    'tomorrow' => 'Write end-to-end integration tests and prepare the migration guide.',
                ],
                'tags' => ['Work', 'Ideas'],
            ],
            // 3. Daily Planner - Oct 4
            [
                'title' => 'Sprint Milestones & Deep Work Execution',
                'type' => 'planner',
                'mood' => 'excited',
                'mood_score' => 9,
                'journal_date' => $today->copy()->subDays(2)->toDateString(),
                'is_favorite' => true,
                'is_draft' => false,
                'content' => "<p>High energy Sunday preparing the upcoming week with zero friction.</p>",
                'data' => [
                    'goals' => 'Finalize API specs, complete 5km morning run, prep weekly meal prep.',
                    'important_tasks' => '1. Audit database indexes. 2. Draft the quarterly product roadmap.',
                    'checklist' => [
                        ['id' => 1, 'text' => 'Finish Laravel Sanctum API authentication tests', 'completed' => true],
                        ['id' => 2, 'text' => '30 minutes zone 2 cardio & mobility', 'completed' => true],
                        ['id' => 3, 'text' => 'Read chapter 4 of Clean Architecture', 'completed' => true],
                        ['id' => 4, 'text' => 'Call Mom and check in on family plans', 'completed' => true],
                        ['id' => 5, 'text' => 'Water all balcony plants and herbs', 'completed' => true],
                    ],
                    'completed_tasks' => 'All critical tasks checked off by 4:00 PM!',
                    'notes' => 'Structuring tasks into morning vs afternoon blocks significantly cut down context switching.',
                    'tomorrow_priorities' => 'Focus morning block entirely on frontend state synchronization.',
                ],
                'tags' => ['Work', 'Goals'],
            ],
            // 4. Mood Journal - Oct 3
            [
                'title' => 'Settling Down After a Demanding Sprint',
                'type' => 'mood',
                'mood' => 'calm',
                'mood_score' => 8,
                'journal_date' => $today->copy()->subDays(3)->toDateString(),
                'is_favorite' => false,
                'is_draft' => false,
                'content' => "<p>Felt a wave of fatigue around noon, but a quiet walk in the park reset my mental state.</p>",
                'data' => [
                    'what_happened' => 'We wrapped up a 2-week sprint under tight deadlines. Even with success, the nervous system stays revved up.',
                    'why_feel_this_way' => 'Caffeine intake was slightly too high and sitting for prolonged hours accumulated tension in the neck.',
                    'what_helped' => 'Turned off Slack notifications, took a 45-minute stroll under the pine trees, and drank a large bottle of electrolyte water.',
                    'additional_thoughts' => 'Rest is not a reward for work; rest is an essential prerequisite for quality output.',
                ],
                'tags' => ['Personal', 'Mindfulness'],
            ],
            // 5. Gratitude Journal - Oct 2
            [
                'title' => 'Morning Sunshine, Crisp Air, and Quiet Coffee',
                'type' => 'gratitude',
                'mood' => 'happy',
                'mood_score' => 9,
                'journal_date' => $today->copy()->subDays(4)->toDateString(),
                'is_favorite' => true,
                'is_draft' => false,
                'content' => "<p>There is a special peace in waking up before the rest of the neighborhood begins to stir.</p>",
                'data' => [
                    'items' => [
                        'The smell of freshly ground Ethiopian roast drifting through the kitchen.',
                        'Clean, crisp autumn air coming through the open study window.',
                        'The warmth of our dog sleeping curled up beside my chair.',
                        'Having dependable friends who message just to see how my week is going.',
                    ],
                    'good_thing' => 'Received an unexpected email saying our open-source proposal was accepted!',
                    'someone_appreciated' => 'Appreciated Elena for bringing over warm sourdough bread yesterday.',
                    'positive_thought' => 'Small daily habits, quietly maintained, accumulate into transformative change.',
                    'looking_forward' => 'The weekend hiking trip up Mount Baldy.',
                ],
                'tags' => ['Personal', 'Family'],
            ],
            // 6. Free Writing - Oct 1
            [
                'title' => 'The Stream of Consciousness and Creative Drift',
                'type' => 'free_writing',
                'mood' => 'calm',
                'mood_score' => 8,
                'journal_date' => $today->copy()->subDays(5)->toDateString(),
                'is_favorite' => false,
                'is_draft' => false,
                'content' => "<p>Words spilling onto the screen without the inner editor whispering critique. That is the only way genuine creativity happens. We edit too soon. We shape before the clay is even moist. Let the raw impulse tumble forward first.</p><p>Thinking about how technology tools should feel invisible. The best notebook is the one you forget you are writing into. It shouldn't scream for your attention with badge counts or neon banners; it should yield to your fingertips like smooth vellum paper.</p>",
                'data' => null,
                'tags' => ['Ideas'],
            ],
            // 7. Travel Journal - Sep 28
            [
                'title' => 'Enchanted Pathways: Exploring Kyoto by Foot',
                'type' => 'travel',
                'mood' => 'excited',
                'mood_score' => 10,
                'journal_date' => $today->copy()->subDays(8)->toDateString(),
                'is_favorite' => true,
                'is_draft' => false,
                'content' => "<p>We took the early morning bus toward Arashiyama before the crowds arrived. The bamboo grove swayed softly with a hollow, rhythmic clicking sound as the wind drifted down from the northern hills.</p><p>We stopped at a tiny kissaten cafe down a stone-paved alley. The master served hand-dripped dark roast coffee alongside warm matcha warabi mochi dusted with roasted soybean powder.</p>",
                'data' => [
                    'destination' => 'Kyoto, Japan',
                    'location' => 'Arashiyama & Gion District',
                    'weather' => 'Clear blue skies, 18°C, crisp mountain breeze',
                    'companions' => 'Sarah and Kenji',
                    'highlights' => 'Walking through the bamboo grove at 6:30 AM before anyone else arrived; hearing temple bells echo across the river.',
                    'places_visited' => 'Tenryu-ji Temple, Bamboo Forest, Gio-ji moss garden, Philosopher\'s Path.',
                    'food_tried' => 'Matcha soft serve, yuba kaiseki, hot soba noodles with seasonal wild mushrooms.',
                    'experiences' => 'Purchased a handmade ceramic teacup from an 80-year-old potter in Higashiyama.',
                    'notes' => 'Bring comfortable walking shoes; we easily clocked 24,000 steps today!',
                ],
                'tags' => ['Travel', 'Personal'],
            ],
            // 8. Study Journal - Sep 25
            [
                'title' => 'Mastering Concurrency and Actor Models',
                'type' => 'study',
                'mood' => 'neutral',
                'mood_score' => 7,
                'journal_date' => $today->copy()->subDays(11)->toDateString(),
                'is_favorite' => false,
                'is_draft' => false,
                'content' => "<p>Deep dive into distributed systems concurrency primitives and state synchronization.</p>",
                'data' => [
                    'subject' => 'Distributed Systems & Concurrency',
                    'duration' => '2 hours 45 minutes',
                    'topics' => 'Actor model, message passing concurrency, vector clocks, CRDTs (Conflict-free Replicated Data Types).',
                    'what_learned' => 'How state-based CRDTs merge independently updated replicas without requiring central locks or consensus rounds.',
                    'difficult_concepts' => 'Lattice join operations and ensuring commutativity and idempotence across nested JSON properties.',
                    'questions' => 'How does Log-Structured Merge Tree garbage collection interact with high-frequency tombstone updates?',
                    'notes' => 'Implemented a miniature state-based counter in PHP to test commutative merge operations.',
                    'tomorrow_goal' => 'Read chapter 6 on Byzantine Fault Tolerance.',
                ],
                'tags' => ['Study', 'Ideas'],
            ],
            // 9. Work Journal - Sep 22
            [
                'title' => 'Architecture Strategy & Q4 Tech Debt Triage',
                'type' => 'work',
                'mood' => 'calm',
                'mood_score' => 8,
                'journal_date' => $today->copy()->subDays(14)->toDateString(),
                'is_favorite' => false,
                'is_draft' => false,
                'content' => "<p>Productive leadership meeting defining our engineering priorities for the upcoming cycle.</p>",
                'data' => [
                    'main_tasks' => 'Lead technical triage, review pull requests for API v2 authentication, benchmark database query performance.',
                    'completed_tasks' => 'Approved 4 core PRs; indexed foreign key columns reducing 95th percentile query latency by 42ms.',
                    'pending_tasks' => 'Finalize caching invalidation strategy for multi-tenant data.',
                    'problems' => 'Legacy migrations have inconsistent foreign key naming conventions.',
                    'solutions' => 'Standardized naming convention script in pre-commit hook.',
                    'meetings' => '10:00 AM Sprint Planning, 2:00 PM Tech Lead sync.',
                    'achievements' => 'Clean zero-downtime database migration deployed safely.',
                    'tomorrow_priorities' => 'Draft the developer onboarding guide for the new REST API structure.',
                ],
                'tags' => ['Work'],
            ],
            // 10. Dream Journal - Sep 20
            [
                'title' => 'The Celestial Library Suspended in Clouds',
                'type' => 'dream',
                'mood' => 'excited',
                'mood_score' => 9,
                'journal_date' => $today->copy()->subDays(16)->toDateString(),
                'is_favorite' => true,
                'is_draft' => false,
                'content' => "<p>I was walking inside a vast spiraling library with towering mahogany shelves that stretched infinitely upward into an azure sky filled with slow-moving lavender clouds.</p><p>Instead of letters on paper, opening any book caused soft bioluminescent light to spill into the air, projecting memories like holographic stardust.</p>",
                'data' => [
                    'title' => 'The Celestial Library Suspended in Clouds',
                    'people' => 'A mysterious elderly librarian holding an ornate brass lantern; my childhood friend Marcus.',
                    'location' => 'An infinite floating rotunda above an endless calm ocean.',
                    'emotions' => 'Awe, nostalgia, profound tranquility, mild curiosity.',
                    'interesting_details' => 'The floor was made of polished obsidian that mirrored constellations not visible from Earth.',
                    'interpretation' => 'Reflects my desire to organize the overwhelming amount of reading and ideas I have gathered recently.',
                ],
                'tags' => ['Personal', 'Ideas'],
            ],
            // 11. Daily Reflection - Sep 17
            [
                'title' => 'Patience in Communication and Listening First',
                'type' => 'reflection',
                'mood' => 'calm',
                'mood_score' => 8,
                'journal_date' => $today->copy()->subDays(19)->toDateString(),
                'is_favorite' => false,
                'is_draft' => false,
                'content' => "<p>Noticed how tempting it is to formulate a rebuttal while someone is still speaking. Practiced active silence today.</p>",
                'data' => [
                    'highlight' => 'A constructive conversation with our design lead where we bridged two diverging views on layout density.',
                    'challenges' => 'Resisting the urge to immediately jump to implementation before fully validating the user need.',
                    'gratitude' => 'Grateful for teammates who speak directly and prioritize product clarity over ego.',
                    'lessons' => 'People don\'t need immediate solutions nearly as much as they need to feel accurately understood.',
                    'tomorrow' => 'Schedule quiet morning focus time before checking team messages.',
                ],
                'tags' => ['Work', 'Mindfulness'],
            ],
            // 12. Planner - Sep 14
            [
                'title' => 'Weekend Recharging & Book Review Session',
                'type' => 'planner',
                'mood' => 'happy',
                'mood_score' => 8,
                'journal_date' => $today->copy()->subDays(22)->toDateString(),
                'is_favorite' => false,
                'is_draft' => false,
                'content' => "<p>Dedicated Saturday for creative exploration and wellness.</p>",
                'data' => [
                    'goals' => 'Finish notes on Deep Work, visit farmers market, bake sourdough.',
                    'important_tasks' => 'Buy fresh honey and figs from market; complete 30-page reading.',
                    'checklist' => [
                        ['id' => 1, 'text' => 'Visit local farmers market at 9:00 AM', 'completed' => true],
                        ['id' => 2, 'text' => 'Bake country loaf sourdough bread', 'completed' => true],
                        ['id' => 3, 'text' => 'Read chapter 3 of Cal Newport\'s Deep Work', 'completed' => true],
                        ['id' => 4, 'text' => 'Call grandparents for Sunday catch-up', 'completed' => true],
                    ],
                    'completed_tasks' => 'Sourdough came out with wonderful blistering and airy crumb!',
                    'notes' => 'Unplugging from screens for 8 consecutive hours brought such deep mental rest.',
                    'tomorrow_priorities' => 'Light evening planning for the week ahead.',
                ],
                'tags' => ['Personal', 'Family'],
            ],
            // 13. Mood Journal - Sep 10
            [
                'title' => 'Navigating Mid-Week Overwhelm',
                'type' => 'mood',
                'mood' => 'stressed',
                'mood_score' => 4,
                'journal_date' => $today->copy()->subDays(26)->toDateString(),
                'is_favorite' => false,
                'is_draft' => false,
                'content' => "<p>A high-friction day with multiple conflicting priorities demanding immediate attention.</p>",
                'data' => [
                    'what_happened' => 'Three production tickets surfaced simultaneously while a deployment deadline was looming.',
                    'why_feel_this_way' => 'Felt pulled in too many directions without time to do any single task thoroughly.',
                    'what_helped' => 'Wrote down all pending items on paper, ranked by actual business risk, communicated clear timelines, and stepped away for a 15-minute tea break.',
                    'additional_thoughts' => 'Urgency is often an illusion manufactured by inadequate prioritization. Protect your attention.',
                ],
                'tags' => ['Work', 'Mindfulness'],
            ],
            // 14. Classic - Sep 05
            [
                'title' => 'Coffee, Raindrops on Glass, and Old Notebooks',
                'type' => 'classic',
                'mood' => 'calm',
                'mood_score' => 9,
                'journal_date' => $today->copy()->subDays(31)->toDateString(),
                'is_favorite' => true,
                'is_draft' => false,
                'content' => "<p>A steady grey rain has been falling since dawn. The gentle patter against the window panes forms the most soothing ambient soundtrack for writing.</p><p>I pulled down a journal from three years ago and read my entries from when I was first learning Laravel and modern JavaScript. It is humbling and empowering to see how things that once terrified me have now become second nature.</p><p>Progress is usually invisible in the daily micro-steps, but breathtaking when viewed across the span of years.</p>",
                'data' => null,
                'tags' => ['Personal', 'Mindfulness'],
            ],
            // 15. Gratitude - Aug 28
            [
                'title' => 'Summer Farewells and Counting Little Joys',
                'type' => 'gratitude',
                'mood' => 'happy',
                'mood_score' => 9,
                'journal_date' => $today->copy()->subDays(39)->toDateString(),
                'is_favorite' => false,
                'is_draft' => false,
                'content' => "<p>As summer winds down, the evenings bring a pleasant coolness that makes outdoor dinners a treat.</p>",
                'data' => [
                    'items' => [
                        'Eating ripe heirloom tomatoes with fresh basil and olive oil.',
                        'The reliable health and laughter of my family.',
                        'Having work that challenges my intellect and allows creative expression.',
                        'The quiet comfort of our home after a busy day.',
                    ],
                    'good_thing' => 'Had an impromptu barbecue dinner in the backyard with close neighbors.',
                    'someone_appreciated' => 'My partner for taking care of errands so I could rest my sprained ankle.',
                    'positive_thought' => 'Gratitude turns what we already have into enough, and more.',
                    'looking_forward' => 'The vibrant colors of the coming autumn foliage.',
                ],
                'tags' => ['Family', 'Personal'],
            ],
            // 16. Travel - Aug 18
            [
                'title' => 'Coastal Wonder: Walking the Cliffs of Amalfi',
                'type' => 'travel',
                'mood' => 'excited',
                'mood_score' => 10,
                'journal_date' => $today->copy()->subDays(49)->toDateString(),
                'is_favorite' => true,
                'is_draft' => false,
                'content' => "<p>The Path of the Gods (Sentiero degli Dei) high above the Tyrrhenian Sea is one of the most awe-inspiring hikes in Southern Europe. Stone shepherd cottages cling to sheer limestone crags covered in wild rosemary and lemon orchards.</p>",
                'data' => [
                    'destination' => 'Amalfi Coast, Italy',
                    'location' => 'Bomerano to Nocelle',
                    'weather' => 'Sunny, 26°C with sea breeze',
                    'companions' => 'Sarah',
                    'highlights' => 'Panoramic vistas of the turquoise Mediterranean from 600 meters above sea level; freshly squeezed lemon granita in Nocelle.',
                    'places_visited' => 'Positano, Praiano, Ravello cliff gardens.',
                    'food_tried' => 'Scialatielli ai frutti di mare, buffalo mozzarella, lemon sorbet served inside frozen lemons.',
                    'experiences' => 'Took the ferry back to Amalfi as the sun dipped behind the Capri cliffs.',
                    'notes' => 'Start the hike by 8:00 AM to avoid the midday sun.',
                ],
                'tags' => ['Travel'],
            ],
            // 17. Study - Aug 10
            [
                'title' => 'Cognitive Psychology: Attention Spans and Flow',
                'type' => 'study',
                'mood' => 'neutral',
                'mood_score' => 8,
                'journal_date' => $today->copy()->subDays(57)->toDateString(),
                'is_favorite' => false,
                'is_draft' => false,
                'content' => "<p>Notes on Mihaly Csikszentmihalyi's seminal research on Optimal Experience.</p>",
                'data' => [
                    'subject' => 'Cognitive Psychology & Focus',
                    'duration' => '1 hour 45 minutes',
                    'topics' => 'Flow triggers, optimal challenge vs skill ratio, dopamine circuits in deep focus.',
                    'what_learned' => 'Flow requires clear goals, immediate feedback, and a challenge that stretches current ability by roughly 4-8%.',
                    'difficult_concepts' => 'Neurochemistry of flow: interplay between norepinephrine, dopamine, and anandamide.',
                    'questions' => 'Can interface design intentionally induce lower cognitive switching penalties?',
                    'notes' => 'Designing apps that respect user attention creates significantly stronger retention than deceptive notifications.',
                    'tomorrow_goal' => 'Synthesize findings into an article draft.',
                ],
                'tags' => ['Study', 'Ideas'],
            ],
            // 18. Work - Jul 30
            [
                'title' => 'Mid-Year Architecture Review & Database Scaling',
                'type' => 'work',
                'mood' => 'calm',
                'mood_score' => 8,
                'journal_date' => $today->copy()->subDays(68)->toDateString(),
                'is_favorite' => false,
                'is_draft' => false,
                'content' => "<p>Completed mid-year engineering benchmarks and infrastructure capacity planning.</p>",
                'data' => [
                    'main_tasks' => 'Analyze read/write query ratios, benchmark Redis caching layer, review API latency metrics.',
                    'completed_tasks' => 'Implemented read replica routing and query caching for dashboard analytics.',
                    'pending_tasks' => 'Update backup verification playbook.',
                    'problems' => 'Periodic spike during 9 AM UTC reporting runs.',
                    'solutions' => 'Offloaded heavy aggregate queries to background worker jobs.',
                    'meetings' => '11:00 AM Executive Tech Briefing.',
                    'achievements' => 'Achieved 99.98% API availability across the past 6 months.',
                    'tomorrow_priorities' => 'Begin sprint planning for Q3 features.',
                ],
                'tags' => ['Work'],
            ],
            // 19. Free Writing - Jul 15
            [
                'title' => 'Late Night Musings on Ambition and Stillness',
                'type' => 'free_writing',
                'mood' => 'calm',
                'mood_score' => 8,
                'journal_date' => $today->copy()->subDays(83)->toDateString(),
                'is_favorite' => false,
                'is_draft' => false,
                'content' => "<p>It is easy to equate productivity with motion. But motion without direction is just friction. Sometimes the most productive thing an engineer or writer can do is sit still for thirty minutes staring out the window, allowing the subconscious to untangle the knot.</p><p>We live in a culture obsessed with measuring output metrics. Words per minute, commits per week, sprints completed. Yet the single line of code that prevents an outage, or the single sentence that strikes straight to the heart of a story, took years of accumulated discernment to produce.</p>",
                'data' => null,
                'tags' => ['Ideas', 'Personal'],
            ],
            // 20. Dream Journal - Jun 25
            [
                'title' => 'The Sunken Metro and Glowing Coral Stations',
                'type' => 'dream',
                'mood' => 'excited',
                'mood_score' => 9,
                'journal_date' => $today->copy()->subDays(103)->toDateString(),
                'is_favorite' => false,
                'is_draft' => false,
                'content' => "<p>Riding a transparent glass subway train smoothly traveling along submerged tracks through a bioluminescent coral canyon.</p><p>Manta rays with geometric patterned skin swam alongside the windows. The conductor announced stations named after classical musical intervals.</p>",
                'data' => [
                    'title' => 'The Sunken Metro and Glowing Coral Stations',
                    'people' => 'A smiling conductor with a silver pocket watch; commuters carrying floating lantern globes.',
                    'location' => 'An underwater transit network beneath a luminous archipelago.',
                    'emotions' => 'Fascination, tranquility, wonder.',
                    'interesting_details' => 'The water was crystal clear and warm, illuminated by glowing anemones.',
                    'interpretation' => 'Symbolizes navigating through deep thoughts and subterranean emotions with calm guidance.',
                ],
                'tags' => ['Personal', 'Ideas'],
            ],
            // 21. Draft 1 - Planner Draft
            [
                'title' => 'Weekend Camping & Hiking Gear Checklist',
                'type' => 'planner',
                'mood' => 'excited',
                'mood_score' => 8,
                'journal_date' => $today->copy()->subDays(1)->toDateString(),
                'is_favorite' => false,
                'is_draft' => true,
                'content' => "<p>Unfinished packing list for the upcoming Yosemite trip...</p>",
                'data' => [
                    'goals' => 'Pack all essentials without overpacking backpack.',
                    'important_tasks' => 'Check water filtration system and headlamp batteries.',
                    'checklist' => [
                        ['id' => 1, 'text' => 'Lightweight 2-person tent & stakes', 'completed' => true],
                        ['id' => 2, 'text' => 'Sleeping pad and 20°F down sleeping bag', 'completed' => true],
                        ['id' => 3, 'text' => 'Portable camp stove & fuel canister', 'completed' => false],
                        ['id' => 4, 'text' => 'Bear canister & dehydrated meal packs', 'completed' => false],
                        ['id' => 5, 'text' => 'First aid kit and blister moleskin', 'completed' => false],
                    ],
                    'completed_tasks' => '',
                    'notes' => 'Verify campsite permit confirmation printout.',
                    'tomorrow_priorities' => 'Stop by REI for extra fuel.',
                ],
                'tags' => ['Travel', 'Goals'],
            ],
            // 22. Draft 2 - Classic Draft
            [
                'title' => 'Draft Thoughts on the Architecture of Attention',
                'type' => 'classic',
                'mood' => 'neutral',
                'mood_score' => 6,
                'journal_date' => $today->toDateString(),
                'is_favorite' => false,
                'is_draft' => true,
                'content' => "<p>Notes for the upcoming essay: how modern notifications hijack dopamine baseline levels, and why calm software design is the antidote. Still developing the second section...</p>",
                'data' => null,
                'tags' => ['Ideas'],
            ],
            // 23. Mood Journal - Oct 6 (Second entry on today to test multiple entries same day!)
            [
                'title' => 'Morning Energy & Coffee Ritual',
                'type' => 'mood',
                'mood' => 'happy',
                'mood_score' => 9,
                'journal_date' => $today->toDateString(),
                'is_favorite' => false,
                'is_draft' => false,
                'content' => "<p>Started the day with a solid pour-over coffee, 10 minutes of stretching, and an upbeat playlist.</p>",
                'data' => [
                    'what_happened' => 'Woke up naturally at 6:45 AM feeling well-rested.',
                    'why_feel_this_way' => 'Consistent sleep schedule over the last 5 days.',
                    'what_helped' => 'Left phone in the living room overnight instead of next to the pillow.',
                    'additional_thoughts' => 'Small physical boundaries create massive mental peace.',
                ],
                'tags' => ['Personal', 'Mindfulness'],
            ],
        ];

        foreach ($journals as $jData) {
            $tagNames = $jData['tags'] ?? [];
            unset($jData['tags']);

            $jData['user_id'] = $user->id;
            $entry = JournalEntry::create($jData);

            $entryTagIds = [];
            foreach ($tagNames as $name) {
                if (isset($tags[$name])) {
                    $entryTagIds[] = $tags[$name];
                }
            }
            if (! empty($entryTagIds)) {
                $entry->tags()->sync($entryTagIds);
            }
        }
    }
}
