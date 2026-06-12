import React, { useState } from "react";
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
} from "react-native";

// Requires: npx expo install nativewind tailwindcss
// tailwind.config.js content: ["./app/**/*.{ts,tsx}", "./components/**/*.{ts,tsx}"]
// babel.config.js plugins: ["nativewind/babel"]

const SLIDES = ["slide1", "slide2", "slide3", "slide4", "slide5"];

const REVIEWS = [
  {
    id: "1",
    user: "luizaarara3287",
    rating: 5,
    comment: "Filme chique show legal!!!",
  },
  {
    id: "2",
    user: "carlosm99",
    rating: 4,
    comment: "Clássico do terror, muito bom!",
  },
];

function StarRating({ rating }: { rating: number }) {
  return (
    <View className="flex-row gap-x-0.5">
      {[1, 2, 3, 4, 5].map((i) => (
        <Text
          key={i}
          className={`text-sm leading-4 ${
            i <= rating ? "text-yellow-400" : "text-stone-300"
          }`}
        >
          ★
        </Text>
      ))}
    </View>
  );
}

function ReviewCard({
  user,
  rating,
  comment,
}: {
  user: string;
  rating: number;
  comment: string;
}) {
  return (
    <View className="bg-amber-50 rounded-xl p-3 mb-2.5 border border-stone-200">
      <View className="flex-row items-center gap-x-2.5 mb-1.5">
        <View className="w-9 h-9 rounded-full bg-amber-400 items-center justify-center">
          <Text className="text-base font-bold text-stone-800">
            {user[0].toUpperCase()}
          </Text>
        </View>
        <View className="flex-1">
          <Text className="text-sm font-semibold text-stone-800 mb-0.5">
            {user}
          </Text>
          <StarRating rating={rating} />
        </View>
      </View>
      <Text className="text-sm text-stone-500 leading-[18px]">{comment}</Text>
    </View>
  );
}

export default function ProductDetailScreen() {
  const [activeSlide, setActiveSlide] = useState(0);

  return (
    <ScrollView
      className="flex-1 bg-stone-100"
      contentContainerClassName="pb-8"
      showsVerticalScrollIndicator={false}
    >
      {/* Main Image */}
      <View className="w-full aspect-video bg-stone-300 items-center justify-center">
        <Text className="text-5xl">🎬</Text>
      </View>

      {/* Thumbnail Strip */}
      <View className="flex-row items-center py-2.5 px-2 bg-stone-100">
        <TouchableOpacity
          className="px-1"
          onPress={() => setActiveSlide((p) => Math.max(0, p - 1))}
        >
          <Text className="text-lg font-semibold text-stone-500">{"<"}</Text>
        </TouchableOpacity>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerClassName="flex-row items-center gap-x-1.5 px-1"
        >
          {SLIDES.map((_, i) => (
            <TouchableOpacity
              key={i}
              onPress={() => setActiveSlide(i)}
              className={`w-12 h-12 rounded-md overflow-hidden border-2 ${
                i === activeSlide ? "border-red-700" : "border-transparent"
              }`}
            >
              <View className="flex-1 bg-stone-400" />
            </TouchableOpacity>
          ))}
        </ScrollView>

        <TouchableOpacity
          className="px-1"
          onPress={() =>
            setActiveSlide((p) => Math.min(SLIDES.length - 1, p + 1))
          }
        >
          <Text className="text-lg font-semibold text-stone-500">{">"}</Text>
        </TouchableOpacity>
      </View>

      {/* Title & Description */}
      <View className="px-4 pt-1 pb-2">
        <Text className="text-[17px] font-bold text-stone-900 mb-2 tracking-wide">
          Sexta-feira 13 · Vol.1
        </Text>
        <Text className="text-[13px] leading-[19px] text-stone-500">
          A história de um antigo homicídio em Crystal Lake não impede que
          alguns jovens montem um acampamento de verão no bosque. Moradores
          supersticiosos advertem sobre o ocorrido, mas os instrutores Jack,
          Alice, Bill, Marcie e Ned prestam pouca atenção aos mais velhos e
          acabam sendo perseguidos por um assassino brutal.
        </Text>
      </View>

      {/* CTA Buttons */}
      <View className="flex-row items-center gap-x-3 px-4 py-4">
        <TouchableOpacity
          activeOpacity={0.85}
          className="flex-1 bg-amber-400 rounded-lg py-3.5 items-center justify-center shadow shadow-amber-700"
        >
          <Text className="text-sm font-extrabold text-stone-900 tracking-widest">
            COMPRAR AGORA
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          activeOpacity={0.85}
          className="w-[52px] h-[52px] bg-amber-400 rounded-lg items-center justify-center shadow shadow-amber-700"
        >
          <Text className="text-2xl">🛒</Text>
        </TouchableOpacity>
      </View>

      {/* Divider */}
      <View className="h-px bg-stone-200 mx-4 mb-4" />

      {/* Reviews */}
      <View className="px-4">
        <Text className="text-[15px] font-bold text-stone-900 mb-3">
          Avaliações
        </Text>
        {REVIEWS.map((r) => (
          <ReviewCard
            key={r.id}
            user={r.user}
            rating={r.rating}
            comment={r.comment}
          />
        ))}
      </View>
    </ScrollView>
  );
}