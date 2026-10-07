<?php

namespace App\Http\Controllers\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\Rule;

class AdminUserController extends Controller
{
    /**
     * List all users with search, role filters, entry count, and pagination.
     */
    public function index(Request $request): JsonResponse
    {
        $query = User::withCount(['journalEntries', 'tags']);

        if ($search = $request->input('search')) {
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        if ($role = $request->input('role')) {
            if ($role === 'admin') {
                $query->where(function ($q) {
                    $q->where('is_admin', true)->orWhere('role', 'admin');
                });
            } elseif ($role === 'user') {
                $query->where('is_admin', false)->where(function ($q) {
                    $q->where('role', 'user')->orWhereNull('role');
                });
            }
        }

        $sort = $request->input('sort', 'latest');
        if ($sort === 'oldest') {
            $query->oldest();
        } elseif ($sort === 'name') {
            $query->orderBy('name');
        } elseif ($sort === 'entries') {
            $query->orderByDesc('journal_entries_count');
        } else {
            $query->latest();
        }

        $perPage = (int) $request->input('per_page', 15);
        $users = $query->paginate($perPage);

        $transformed = $users->getCollection()->map(function ($u) {
            return [
                'id' => $u->id,
                'name' => $u->name,
                'email' => $u->email,
                'role' => $u->role ?? ($u->is_admin ? 'admin' : 'user'),
                'is_admin' => (bool) $u->isAdmin(),
                'avatar' => $u->avatar ? (str_starts_with($u->avatar, 'http') ? $u->avatar : asset('storage/' . $u->avatar)) : null,
                'bio' => $u->bio,
                'journal_entries_count' => $u->journal_entries_count,
                'tags_count' => $u->tags_count,
                'created_at' => $u->created_at?->toISOString(),
            ];
        });

        return response()->json([
            'success' => true,
            'data' => $transformed,
            'meta' => [
                'current_page' => $users->currentPage(),
                'last_page' => $users->lastPage(),
                'per_page' => $users->perPage(),
                'total' => $users->total(),
            ],
        ]);
    }

    /**
     * Store a newly created user from the admin panel.
     */
    public function store(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|string|email|max:255|unique:users,email',
            'password' => 'required|string|min:6',
            'role' => 'required|in:admin,user',
            'bio' => 'nullable|string|max:1000',
        ]);

        $user = User::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'password' => Hash::make($validated['password']),
            'role' => $validated['role'],
            'is_admin' => $validated['role'] === 'admin',
            'bio' => $validated['bio'] ?? null,
            'settings' => [
                'theme' => 'light',
                'auto_save' => true,
                'font_family' => 'sans',
            ],
        ]);

        return response()->json([
            'success' => true,
            'message' => 'User created successfully.',
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'is_admin' => (bool) $user->isAdmin(),
                'bio' => $user->bio,
                'created_at' => $user->created_at?->toISOString(),
            ],
        ], 201);
    }

    /**
     * Update an existing user.
     */
    public function update(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|max:255',
            'email' => ['required', 'string', 'email', 'max:255', Rule::unique('users')->ignore($user->id)],
            'password' => 'nullable|string|min:6',
            'role' => 'required|in:admin,user',
            'bio' => 'nullable|string|max:1000',
        ]);

        $updateData = [
            'name' => $validated['name'],
            'email' => $validated['email'],
            'role' => $validated['role'],
            'is_admin' => $validated['role'] === 'admin',
            'bio' => $validated['bio'] ?? $user->bio,
        ];

        if (! empty($validated['password'])) {
            $updateData['password'] = Hash::make($validated['password']);
        }

        $user->update($updateData);

        return response()->json([
            'success' => true,
            'message' => 'User updated successfully.',
            'data' => [
                'id' => $user->id,
                'name' => $user->name,
                'email' => $user->email,
                'role' => $user->role,
                'is_admin' => (bool) $user->isAdmin(),
                'bio' => $user->bio,
                'created_at' => $user->created_at?->toISOString(),
            ],
        ]);
    }

    /**
     * Delete a user and cascade all their journals/tags.
     */
    public function destroy(Request $request, int $id): JsonResponse
    {
        $user = User::findOrFail($id);

        if ($request->user()->id === $user->id) {
            return response()->json([
                'success' => false,
                'message' => 'You cannot delete your own administrator account.',
            ], 422);
        }

        $user->journalEntries()->delete();
        $user->tags()->delete();
        $user->delete();

        return response()->json([
            'success' => true,
            'message' => 'User and all associated data deleted successfully.',
        ]);
    }
}
