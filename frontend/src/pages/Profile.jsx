import { UserProfile } from "@clerk/react";

function Profile() {
  return (
    <main className="max-w-[1400px] mx-auto px-4 md:px-8 py-12 animate-[fadeIn_0.3s_ease-out] flex justify-center">
      {/* Clerk automatically injects an enterprise-grade profile management dashboard */}
      <UserProfile 
        appearance={{
          elements: {
            card: "shadow-none border border-gray-200 dark:border-gray-800 rounded-3xl dark:bg-black",
            headerTitle: "font-black text-2xl dark:text-white",
            headerSubtitle: "font-bold text-gray-500",
            profileSectionTitleText: "font-bold tracking-widest uppercase dark:text-white",
            profileSectionPrimaryButton: "font-bold dark:text-white",
          }
        }}
      />
    </main>
  )
}

export default Profile